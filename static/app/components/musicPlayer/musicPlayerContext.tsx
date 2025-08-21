import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {MAX_LISTENING_HISTORY_LENGTH} from 'sentry/components/musicPlayer/constants';
import {DEFAULT_PLAYLISTS} from 'sentry/components/musicPlayer/defaultPlaylists';
import {useMusicPlayerPrefs} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';
import {getTracksForProduct} from 'sentry/components/musicPlayer/productTracks';
import {
  useCurrentProduct,
  type Product,
} from 'sentry/components/musicPlayer/useCurrentProduct';
import {useLocation} from 'sentry/utils/useLocation';

export type Track = {
  artist: string;
  id: string;
  src: string;
  title: string;
  isProductTrack?: boolean; // Optional field to mark tracks from product queue
  lyrics?: string | undefined;
  sentiment?: 'positive' | 'negative' | 'neutral'; // Optional field to mark sentiment of the track, for the user feedback product
  sunoLink?: string; // Optional field for direct link to the song on Suno
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

interface MusicPlayerContextProps {
  currentPlaylist: Playlist | null;
  currentProduct: Product | null;
  currentSentiment: string | null; // Current sentiment for feedback pages
  currentTime: number;
  currentTrack: Track | null;
  currentTrackDuration: number;
  historyPosition: number;
  isEnabled: boolean;
  isExpanded: boolean; // expands on hover
  isLoading: boolean;
  isPlaying: boolean;
  listeningHistory: Track[];
  nextTrack: () => void;
  playlists: Playlist[];
  previousTrack: () => void;
  productQueue: Track[]; // Queue of product-specific tracks to play before playlist tracks
  regularQueue: Track[]; // Queue of regular playlist tracks
  seek: (time: number) => void;
  selectPlaylist: (playlist: Playlist) => void;
  setEnabled: (enabled: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  togglePlayPause: () => void;
}

const shufflePlaylistTracks = (tracks: Track[]) =>
  [...tracks].sort(() => Math.random() - 0.5);

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  currentProduct: null,
  currentSentiment: null,
  isEnabled: true,
  isLoading: false,
  currentTime: 0,
  currentTrackDuration: 0,
  isExpanded: false,
  historyPosition: 0,
  listeningHistory: [],
  playlists: [],
  productQueue: [],
  regularQueue: [],
  togglePlayPause: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seek: () => {},
  selectPlaylist: () => {},
  setEnabled: () => {},
  setExpanded: () => {},
});

type Props = {
  children: React.ReactNode;
  /**
   * Override return fields for testing
   */
  value?: Partial<MusicPlayerContextProps>;
};

export function MusicPlayerProvider({children, value = {}}: Props) {
  const [prefs, setPrefs] = useMusicPlayerPrefs();
  const currentProduct = useCurrentProduct();
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isEnabled, setIsEnabled] = useState(prefs.isEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [listeningHistory, setListeningHistory] = useState<Track[]>([]);
  const [historyPosition, setHistoryPosition] = useState(0); // 0 means we're at the most recent track
  const [regularQueue, setRegularQueue] = useState<Track[]>([]);
  const [productQueue, setProductQueue] = useState<Track[]>([]); // Queue of product-specific tracks
  const [currentSentiment, setCurrentSentiment] = useState<string | null>(null); // Track current sentiment to avoid unnecessary restarts

  // Keep track of playing state for auto-resume
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Add a track to listening history and reset historyPosition to 0
  // Skip adding if it's the same as the most recent track
  const addToListeningHistory = useCallback((track: Track) => {
    setListeningHistory(prev => {
      // Don't add if the track is the same as the most recent one
      if (prev.length > 0 && prev[0]?.id === track.id) {
        return prev;
      }
      return [track, ...prev.slice(0, MAX_LISTENING_HISTORY_LENGTH - 1)];
    });
    setHistoryPosition(0);
  }, []);

  // Update productQueue when currentProduct changes
  useEffect(() => {
    if (currentProduct?.id) {
      if (currentProduct.id === 'issues/feedback' || currentProduct.id === 'feedback') {
        return; // This is handled in the below useEffect
      }

      const productTracks = getTracksForProduct(currentProduct.id);
      const queueTracks = productTracks.map(track => ({...track, isProductTrack: true}));

      // Immediately switch to the new product track if we have one
      if (queueTracks.length > 0) {
        const newProductTrack = queueTracks[0]!;
        setCurrentTrack(newProductTrack);
        addToListeningHistory(newProductTrack);

        // Set the queue to the remaining tracks (excluding the first one we're playing)
        setProductQueue(queueTracks.slice(1));
      } else {
        setProductQueue([]);
      }
    } else {
      setProductQueue([]);
    }
  }, [currentProduct?.id, addToListeningHistory]);

  // Handle sentiment changes
  useEffect(() => {
    if (currentProduct?.id === 'issues/feedback' || currentProduct?.id === 'feedback') {
      const urlParams = new URLSearchParams(location.search);
      const sentiment = urlParams.get('sentiment') as
        | 'positive'
        | 'negative'
        | 'neutral'
        | null;

      // Only change music if sentiment has actually changed
      if (sentiment && sentiment !== currentSentiment) {
        setCurrentSentiment(sentiment);

        // Based on the sentiment, remove everything from the product queue and add the sentiment-specific tracks
        const sentimentTracks = getTracksForProduct('issues/feedback').filter(
          track => track.sentiment === sentiment
        );
        // No sentiment means neutral
        const genericFeedbackTracks = getTracksForProduct('issues/feedback').filter(
          track => !track.sentiment
        );

        let tracksToAdd: Track[] = [...genericFeedbackTracks];
        if (sentiment !== 'neutral') {
          tracksToAdd = [...shufflePlaylistTracks(sentimentTracks), ...tracksToAdd];
        }

        setProductQueue(tracksToAdd);

        if (tracksToAdd.length > 0) {
          const newProductTrack = tracksToAdd[0]!;
          const trackWithProductFlag = {...newProductTrack, isProductTrack: true};
          setCurrentTrack(trackWithProductFlag);
          addToListeningHistory(trackWithProductFlag);

          // Set the queue to the remaining tracks (excluding the first one we're playing)
          const remainingTracks = tracksToAdd
            .slice(1)
            .map(track => ({...track, isProductTrack: true}));
          setProductQueue(remainingTracks);
        }
      } else if (!sentiment && currentSentiment !== null) {
        setCurrentSentiment(null);
      } // Else we should keep playing the current track because the sentiment has not changed
    }
  }, [currentProduct, location.search, addToListeningHistory, currentSentiment]);

  // Load track when current track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setCurrentTime(0);
      setCurrentTrackDuration(0);

      const wasPlaying = wasPlayingRef.current;
      setIsPlaying(false);

      audioRef.current.src = currentTrack.src;
      audioRef.current.load();

      // If we were playing, resume once the new track is ready
      if (wasPlaying) {
        const handleCanPlay = () => {
          audioRef.current
            ?.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
          audioRef.current?.removeEventListener('canplay', handleCanPlay);
        };
        audioRef.current.addEventListener('canplay', handleCanPlay);
      }
    }
  }, [currentTrack]);

  // Initialize default playlist from preferences (only once on mount)
  useEffect(() => {
    if (!currentPlaylist) {
      const defaultPlaylist =
        DEFAULT_PLAYLISTS.find(p => p.id === prefs.defaultPlaylistId) ||
        DEFAULT_PLAYLISTS[0] ||
        null;
      setCurrentPlaylist(defaultPlaylist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlaylist]);

  // Set initial track when playlist is available but no current track
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0 && !currentTrack) {
      let initialTrack: Track | null = null;

      // Check product queue first
      if (productQueue.length > 0) {
        initialTrack = productQueue[0]!;
        setProductQueue(productQueue.slice(1));
      }
      // Then check regular queue
      else if (regularQueue.length > 0) {
        initialTrack = regularQueue[0]!;
        setRegularQueue(regularQueue.slice(1));
      }
      // Finally, populate from current playlist
      else {
        const shuffled = shufflePlaylistTracks(currentPlaylist.tracks);
        initialTrack = shuffled[0]!;
        setRegularQueue(shuffled.slice(1));
      }

      if (initialTrack) {
        setCurrentTrack(initialTrack);
        addToListeningHistory(initialTrack);
      }
    }
  }, [currentPlaylist, currentTrack, productQueue, regularQueue, addToListeningHistory]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack || !isEnabled) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Handle autoplay restrictions
          setIsPlaying(false);
        });
    }
  }, [isPlaying, currentTrack, isEnabled]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled) return;

    let nextTrack_: Track | null = null;

    // 1. Check productQueue
    if (productQueue.length > 0) {
      nextTrack_ = productQueue[0]!;

      // Skip if this track is already playing
      if (currentTrack?.id === nextTrack_.id) {
        setProductQueue(productQueue.slice(1));
        // Recursively call nextTrack to get the next available track
        setTimeout(() => nextTrack(), 0);
        return;
      }

      setProductQueue(productQueue.slice(1));
      setCurrentTrack(nextTrack_);

      // Insert product track into history at current position
      setListeningHistory(prev => {
        const newHistory = [...prev];
        newHistory.splice(historyPosition, 0, nextTrack_!);
        return newHistory.slice(0, MAX_LISTENING_HISTORY_LENGTH);
      });
      // Keep historyPosition unchanged - we stay where we were
      return;
    }

    // 2. Navigate through existing history
    if (historyPosition > 0) {
      nextTrack_ = listeningHistory[historyPosition - 1] || null;
      setHistoryPosition(prev => prev - 1);
      setCurrentTrack(nextTrack_);
      return;
    }

    // 3. We're at the top of history, so check regularQueue and playlist
    if (regularQueue.length > 0) {
      nextTrack_ = regularQueue[0]!;
      setRegularQueue(regularQueue.slice(1));
    } else if (currentPlaylist.tracks.length > 0) {
      const shuffled = shufflePlaylistTracks(currentPlaylist.tracks);

      // Ensure the current track is not the first one in the repopulated queue
      if (currentTrack && shuffled[0]?.id === currentTrack.id) {
        const firstTrack = shuffled.shift();
        if (firstTrack) {
          shuffled.push(firstTrack);
        }
      }

      nextTrack_ = shuffled[0]!;
      setRegularQueue(shuffled.slice(1));
    }
    if (nextTrack_) {
      setCurrentTrack(nextTrack_);
      addToListeningHistory(nextTrack_); // Add new tracks to front of history
    }
  }, [
    currentPlaylist,
    isEnabled,
    historyPosition,
    listeningHistory,
    productQueue,
    regularQueue,
    currentTrack,
    addToListeningHistory,
  ]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled || listeningHistory.length === 0) return;

    // If we're on a product queue track, go back to the track that was playing before
    if (currentTrack?.isProductTrack) {
      // The track we want to go back to is at historyPosition + 1 (since product track was injected at historyPosition)
      const nextHistoryPos = historyPosition + 1;
      if (nextHistoryPos >= listeningHistory.length) return;

      const prevTrack = listeningHistory[nextHistoryPos] || null;
      setHistoryPosition(nextHistoryPos);
      setCurrentTrack(prevTrack);
      return;
    }

    // Regular history navigation
    const nextHistoryPos = historyPosition + 1;
    if (nextHistoryPos >= listeningHistory.length) return;

    const prevTrack = listeningHistory[nextHistoryPos] || null;
    setHistoryPosition(nextHistoryPos);
    setCurrentTrack(prevTrack);
  }, [currentPlaylist, isEnabled, historyPosition, listeningHistory, currentTrack]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current || !currentTrackDuration) return;
      const clampedTime = Math.max(0, Math.min(time, currentTrackDuration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [currentTrackDuration]
  );

  const selectPlaylist = useCallback(
    (playlist: Playlist) => {
      setCurrentPlaylist(playlist);
      setRegularQueue([]);

      // If we're currently playing a product song, don't switch tracks yet
      if (currentTrack?.isProductTrack) {
        // Just update the regular queue for when the product song ends
        if (playlist.tracks && playlist.tracks.length > 0) {
          const shuffled = shufflePlaylistTracks(playlist.tracks);
          setRegularQueue(shuffled);
        }
        return;
      }

      let startTrack: Track | null = null;
      let newProductQueue: Track[] = [];

      // Check product queue first
      if (productQueue.length > 0) {
        startTrack = productQueue[0]!;
        newProductQueue = productQueue.slice(1);
      }
      // Use new playlist directly (ignore any stale regular queue)
      else if (playlist.tracks && playlist.tracks.length > 0) {
        const shuffled = shufflePlaylistTracks(playlist.tracks);
        startTrack = shuffled[0]!;
        setRegularQueue(shuffled.slice(1));
      }

      // Update product queue if we modified it
      if (newProductQueue.length !== productQueue.length) {
        setProductQueue(newProductQueue);
      }

      if (startTrack) {
        setCurrentTrack(startTrack);
        addToListeningHistory(startTrack);
      }
    },
    [addToListeningHistory, productQueue, currentTrack]
  );

  // Audio event handlers - memoized to prevent recreation
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setCurrentTrackDuration(audioRef.current.duration);
      // Note: setIsLoading(false) is handled by handleCanPlay
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    // Don't set isPlaying to false here - let nextTrack handle it
    // Keep wasPlayingRef as true so the next track auto-plays
    nextTrack();
  }, [nextTrack]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  // Initialize audio element and attach event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [
    handleLoadStart,
    handleCanPlay,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
    handleError,
  ]);

  const contextValue: MusicPlayerContextProps = {
    isPlaying,
    currentTrack,
    currentPlaylist,
    currentProduct,
    isEnabled,
    isLoading,
    currentTime,
    currentTrackDuration,
    isExpanded,
    historyPosition,
    listeningHistory,
    playlists: DEFAULT_PLAYLISTS,
    productQueue,
    regularQueue,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    selectPlaylist,
    setEnabled: (enabled: boolean) => {
      setIsEnabled(enabled);
      setPrefs({isEnabled: enabled});
    },
    setExpanded: setIsExpanded,
    currentSentiment,
    ...value,
  };

  return <MusicPlayerContext value={contextValue}>{children}</MusicPlayerContext>;
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
