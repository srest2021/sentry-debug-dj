import {createContext, useContext, useEffect, useRef, useState} from 'react';

import {DEFAULT_PLAYLISTS} from 'sentry/components/musicPlayer/defaultPlaylists';
import {useMusicPlayerPrefs} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';
import type {Product} from 'sentry/components/musicPlayer/useCurrentProduct';
import {useCurrentProduct} from 'sentry/components/musicPlayer/useCurrentProduct';

export type Track = {
  artist: string;
  id: string;
  src: string;
  title: string;
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
  productQueue: Track[];
  regularQueue: Track[];
  seek: (time: number) => void;
  selectPlaylist: (playlist: Playlist) => void;
  setEnabled: (enabled: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  togglePlayPause: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
  currentPlaylist: null,
  currentProduct: null,
  currentTime: 0,
  currentTrack: null,
  currentTrackDuration: 0,
  historyPosition: -1,
  isEnabled: false,
  isExpanded: false,
  isLoading: false,
  isPlaying: false,
  listeningHistory: [],
  nextTrack: () => {},
  playlists: DEFAULT_PLAYLISTS,
  previousTrack: () => {},
  productQueue: [],
  regularQueue: [],
  seek: () => {},
  selectPlaylist: () => {},
  setEnabled: () => {},
  setExpanded: () => {},
  togglePlayPause: () => {},
});

type Props = {
  children: React.ReactNode;
  value?: Partial<MusicPlayerContextProps>;
};

export function MusicPlayerProvider({children, value = {}}: Props) {
  const [prefs, setPrefs] = useMusicPlayerPrefs();
  const currentProduct = useCurrentProduct();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(prefs.isEnabled);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(
    DEFAULT_PLAYLISTS[0] || null
  );
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [listeningHistory, setListeningHistory] = useState<Track[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [regularQueue, _setRegularQueue] = useState<Track[]>([]);
  const [productQueue, _setProductQueue] = useState<Track[]>([]); // Queue of product-specific tracks

  // Keep track of playing state for auto-resume
  const [wasPlayingBeforePause, setWasPlayingBeforePause] = useState(false);

  // Update preferences when enabled state changes
  useEffect(() => {
    setPrefs({isEnabled});
  }, [isEnabled, setPrefs]);

  // Auto-resume functionality
  useEffect(() => {
    if (isEnabled && wasPlayingBeforePause && currentTrack) {
      // Small delay to ensure audio element is ready
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isEnabled, wasPlayingBeforePause, currentTrack]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setCurrentTrackDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update current track when playlist changes
  useEffect(() => {
    if (currentPlaylist?.tracks.length) {
      const firstTrack = currentPlaylist.tracks[0];
      if (firstTrack) {
        setCurrentTrack(firstTrack);
        setHistoryPosition(-1);
        setListeningHistory([]);
      }
    }
  }, [currentPlaylist]);

  const contextValue: MusicPlayerContextProps = {
    currentPlaylist,
    currentProduct,
    currentTime,
    currentTrack,
    currentTrackDuration,
    historyPosition,
    isEnabled,
    isExpanded,
    isLoading,
    isPlaying,
    listeningHistory,
    nextTrack: () => {
      // Implementation for next track
    },
    playlists: DEFAULT_PLAYLISTS,
    previousTrack: () => {
      // Implementation for previous track
    },
    productQueue,
    regularQueue,
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    selectPlaylist: (playlist: Playlist) => {
      setCurrentPlaylist(playlist);
    },
    setEnabled: setIsEnabled,
    setExpanded: setIsExpanded,
    togglePlayPause: () => {
      if (!audioRef.current || !currentTrack) return;

      if (isPlaying) {
        audioRef.current.pause();
        setWasPlayingBeforePause(true);
      } else {
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
        setWasPlayingBeforePause(false);
      }
    },
    ...value,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
