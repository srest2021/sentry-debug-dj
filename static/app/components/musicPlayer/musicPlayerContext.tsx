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
  listeningHistory: number[];
  nextTrack: () => void;
  playlists: Playlist[];
  previousTrack: () => void;
  productQueue: Track[]; // Queue of product-specific tracks to play before playlist tracks
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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [listeningHistory, setListeningHistory] = useState<number[]>([]);
  const [historyPosition, setHistoryPosition] = useState(0); // 0 means we're at the most recent track
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

  // Set initial track from playlist
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(currentPlaylist.tracks[0] || null);
      setCurrentTrackIndex(0);
      // Add the initial track to history at position 0
      setListeningHistory([0]);
      setHistoryPosition(0);
    }
  }, [currentPlaylist, currentTrack]);

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

  const getNextTrackIndex = useCallback(() => {
    if (!currentPlaylist) return 0;
    return (currentTrackIndex + 1) % currentPlaylist.tracks.length;
  }, [currentPlaylist, currentTrackIndex]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled) return;

    // If we're not at the top of the stack (position 0), move forward toward it
    if (historyPosition > 0) {
      const nextHistoryIndex = listeningHistory[historyPosition - 1]!;
      const nextTrack_ = currentPlaylist.tracks[nextHistoryIndex] || null;

      setHistoryPosition(prev => prev - 1); // Move toward top of stack (0)
      setCurrentTrack(nextTrack_);
      setCurrentTrackIndex(nextHistoryIndex);
      return;
    }

    // Check if there are tracks in the product queue first
    if (productQueue.length > 0) {
      const nextQueueTrack = productQueue[0]!; // Get first track from queue (already marked as isQueueTrack: true)
      setProductQueue(prev => prev.slice(1)); // Remove the track from queue (pop from front)
      setCurrentTrack(nextQueueTrack);
      // Note: We don't update currentTrackIndex or history for queue tracks since they're not part of the playlist
      return;
    }

    // We're at the top of the stack (position 0) and no queue tracks, get a new track from playlist
    const nextIndex = getNextTrackIndex();
    const nextTrack_ = currentPlaylist.tracks[nextIndex] || null;

    // Push new track to top of stack, keep max 10 items
    const maxHistoryLength = 10;
    setListeningHistory(prev => [nextIndex, ...prev.slice(0, maxHistoryLength - 1)]);
    setHistoryPosition(0); // Stay at top of stack
    setCurrentTrack(nextTrack_);
    setCurrentTrackIndex(nextIndex);
  }, [
    currentPlaylist,
    getNextTrackIndex,
    isEnabled,
    historyPosition,
    listeningHistory,
    productQueue,
  ]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled) return;

    // If we're currently on a queue track, go back to the last playlist track
    if (currentTrack?.isQueueTrack && listeningHistory.length > 0) {
      const lastPlaylistIndex = listeningHistory[historyPosition]!;
      const lastPlaylistTrack = currentPlaylist.tracks[lastPlaylistIndex] || null;

      setCurrentTrack(lastPlaylistTrack);
      setCurrentTrackIndex(lastPlaylistIndex);
      // Don't change historyPosition since we're going back to where we were
      return;
    }

    const nextHistoryPos = historyPosition + 1;

    // Can't go back further if we're already at the bottom of the stack
    if (nextHistoryPos >= listeningHistory.length) {
      return;
    }

    const prevHistoryIndex = listeningHistory[nextHistoryPos]!;
    const prevTrack = currentPlaylist.tracks[prevHistoryIndex] || null;

    setHistoryPosition(nextHistoryPos); // Move deeper into stack
    setCurrentTrack(prevTrack);
    setCurrentTrackIndex(prevHistoryIndex);
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

  const selectPlaylist = useCallback((playlist: Playlist) => {
    setCurrentPlaylist(playlist);

    // Always start with the first track
    const startIndex = 0;

    setCurrentTrack(playlist.tracks[startIndex] || null);
    setCurrentTrackIndex(startIndex);
    setListeningHistory([startIndex]); // Initialize history with starting track
    setHistoryPosition(0); // Start at top of stack
  }, []);

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
