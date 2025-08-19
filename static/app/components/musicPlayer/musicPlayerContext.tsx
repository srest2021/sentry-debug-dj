import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {DEFAULT_PLAYLISTS} from 'sentry/components/musicPlayer/defaultPlaylists';
import {useMusicPlayerPrefs} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';
import {getTracksForProduct} from 'sentry/components/musicPlayer/productTracks';
import {
  useCurrentProduct,
  type Product,
} from 'sentry/components/musicPlayer/useCurrentProduct';

export type Track = {
  artist: string;
  id: string;
  src: string;
  title: string;
  isQueueTrack?: boolean; // Optional field to mark tracks from product queue
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
};

interface MusicPlayerContextProps {
  currentPlaylist: Playlist | null;
  currentProduct: Product | null;
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

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  currentProduct: null,
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

  // Keep track of playing state for auto-resume
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Handle product changes - update queue when product changes
  useEffect(() => {
    if (currentProduct?.id) {
      // Clear queue and add tracks for the new product, marking them as queue tracks
      const productTracks = getTracksForProduct(currentProduct.id);
      const queueTracks = productTracks.map(track => ({...track, isQueueTrack: true}));
      const shuffledTracks = [...queueTracks].sort(() => Math.random() - 0.5);
      setProductQueue(shuffledTracks);
    } else {
      // Clear queue if no product
      setProductQueue([]);
    }
  }, [currentProduct?.id]);

  // Helper function to add track to listening history
  const addToListeningHistory = useCallback((track: Track) => {
    const maxHistoryLength = 10;
    setListeningHistory(prev => [track, ...prev.slice(0, maxHistoryLength - 1)]);
    setHistoryPosition(0);
  }, []);

  // Load track when current track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // Reset state when loading new track
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
  }, [currentPlaylist]); // Only run when currentPlaylist changes, read prefs.defaultPlaylistId once

  // Set initial track from playlist - prioritize product queue
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0 && !currentTrack) {
      let initialTrack: Track | null = null;

      // Priority 1: Check product queue first
      if (productQueue.length > 0) {
        initialTrack = productQueue[0]!;
        setProductQueue(prev => prev.slice(1)); // Remove from queue
      }
      // Priority 2: Fall back to first track from playlist
      else {
        initialTrack = currentPlaylist.tracks[0] || null;
      }

      if (initialTrack) {
        setCurrentTrack(initialTrack);
        addToListeningHistory(initialTrack);
      }
    }
  }, [currentPlaylist, currentTrack, productQueue, addToListeningHistory]);

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

    // PRIORITY 1: Always check product queue first
    if (productQueue.length > 0) {
      nextTrack_ = productQueue[0]!;
      setProductQueue(prev => prev.slice(1));
      setCurrentTrack(nextTrack_);

      // Insert product track into history at current position
      setListeningHistory(prev => {
        const newHistory = [...prev];
        newHistory.splice(historyPosition, 0, nextTrack_!);
        return newHistory.slice(0, 10); // Keep max 10 items
      });

      // Keep historyPosition unchanged - we stay where we were
      return;
    }

    // PRIORITY 2: Navigate through existing history
    if (historyPosition > 0) {
      nextTrack_ = listeningHistory[historyPosition - 1] || null;
      setHistoryPosition(prev => prev - 1);
      setCurrentTrack(nextTrack_);
      return;
    }

    // PRIORITY 3: We're at top of history, get new track from regular queue
    if (regularQueue.length > 0) {
      nextTrack_ = regularQueue[0]!;
      setRegularQueue(prev => prev.slice(1));
    }
    // PRIORITY 4: Regular queue empty, refill with shuffled playlist
    else if (currentPlaylist.tracks.length > 0) {
      const shuffled = [...currentPlaylist.tracks].sort(() => Math.random() - 0.5);
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
    addToListeningHistory,
  ]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled || listeningHistory.length === 0) return;

    // If we're on a product queue track, go back to the track that was playing before
    if (currentTrack?.isQueueTrack) {
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

      // Clamp time to valid range
      const clampedTime = Math.max(0, Math.min(time, currentTrackDuration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [currentTrackDuration]
  );

  const selectPlaylist = useCallback(
    (playlist: Playlist) => {
      setCurrentPlaylist(playlist);

      // Clear regular queue and history on playlist change (keep product queue)
      setRegularQueue([]);
      setListeningHistory([]);
      setHistoryPosition(0);

      // Start with first track - prioritize product queue
      let startTrack: Track | null = null;

      // Priority 1: Check product queue first
      if (productQueue.length > 0) {
        startTrack = productQueue[0]!;
        setProductQueue(prev => prev.slice(1)); // Remove from queue
      }
      // Priority 2: Fall back to first track from playlist
      else {
        startTrack = playlist.tracks[0] || null;
      }

      if (startTrack) {
        setCurrentTrack(startTrack);
        addToListeningHistory(startTrack);
      }
    },
    [addToListeningHistory, productQueue]
  );

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setCurrentTrackDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

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
  }, [nextTrack]);

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
    ...value,
  };

  return <MusicPlayerContext value={contextValue}>{children}</MusicPlayerContext>;
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
