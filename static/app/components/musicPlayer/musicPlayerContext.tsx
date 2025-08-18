import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {useMusicPlayerPrefs} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';

export type Track = {
  artist: string;
  duration: number;
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
  currentTime: number;
  currentTrack: Track | null;
  currentTrackDuration: number;
  isEnabled: boolean;
  isExpanded: boolean; // expands on hover
  isLoading: boolean;
  isPlaying: boolean;
  nextTrack: () => void;
  playlists: Playlist[];
  previousTrack: () => void;
  selectPlaylist: (playlist: Playlist) => void;
  setEnabled: (enabled: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  shuffle: boolean;
  togglePlayPause: () => void;
  toggleShuffle: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  shuffle: false,
  isEnabled: true,
  isLoading: false,
  currentTime: 0,
  currentTrackDuration: 0,
  isExpanded: false,
  playlists: [],
  togglePlayPause: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  toggleShuffle: () => {},
  selectPlaylist: () => {},
  setEnabled: () => {},
  setExpanded: () => {},
});

const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'debugging-beats',
    name: 'Debugging Beats',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
    },
    tracks: [
      {
        id: 'synth-1',
        title: 'Digital Dreams',
        artist: 'Code Runner',
        src: '/static/music/debugging-beats/digital-dreams.mp3',
        duration: 100,
      },
      {
        id: 'synth-2',
        title: 'Binary Sunset',
        artist: 'Pixel Prophet',
        src: '/static/music/debugging-beats/binary-sunset.mp3',
        duration: 100,
      },
    ],
  },
  {
    id: 'metal-mode',
    name: 'Metal Mode',
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#ea580c',
    },
    tracks: [
      {
        id: 'metal-1',
        title: 'Stack Overflow',
        artist: 'Exception Handler',
        src: '/static/music/metal-mode/stack-overflow.mp3',
        duration: 100,
      },
      {
        id: 'metal-2',
        title: 'Memory Leak',
        artist: 'Segmentation Fault',
        src: '/static/music/metal-mode/memory-leak.mp3',
        duration: 100,
      },
    ],
  },
  {
    id: 'minecraft-vibes',
    name: 'Minecraft Vibes',
    theme: {
      primaryColor: '#22c55e',
      secondaryColor: '#84cc16',
    },
    tracks: [
      {
        id: 'minecraft-1',
        title: 'Block by Block',
        artist: 'Craft Master',
        src: '/static/music/minecraft-vibes/block-by-block.mp3',
        duration: 100,
      },
      {
        id: 'minecraft-2',
        title: 'Redstone Circuit',
        artist: 'Pixel Builder',
        src: '/static/music/minecraft-vibes/redstone-circuit.mp3',
        duration: 100,
      },
    ],
  },
];

type Props = {
  children: React.ReactNode;
  /**
   * Override return fields for testing
   */
  value?: Partial<MusicPlayerContextProps>;
};

export function MusicPlayerProvider({children, value = {}}: Props) {
  const [prefs, setPrefs] = useMusicPlayerPrefs();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [shuffle, setShuffle] = useState(prefs.shuffle);
  const [isEnabled, setIsEnabled] = useState(prefs.isEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<number[]>([]);

  // Load track when current track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Initialize default playlist from preferences
  useEffect(() => {
    if (!currentPlaylist) {
      const defaultPlaylist =
        DEFAULT_PLAYLISTS.find(p => p.id === prefs.defaultPlaylistId) ||
        DEFAULT_PLAYLISTS[0] ||
        null;
      setCurrentPlaylist(defaultPlaylist);
    }
  }, [prefs.defaultPlaylistId, currentPlaylist]);

  // Set initial track from playlist
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(currentPlaylist.tracks[0] || null);
      setCurrentTrackIndex(0);
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

    if (shuffle) {
      // Avoid recently played tracks (last 3 tracks or half the playlist, whichever is smaller)
      const maxRecentTracks = Math.min(3, Math.floor(currentPlaylist.tracks.length / 2));
      const recentTracksToAvoid = [
        currentTrackIndex,
        ...recentlyPlayed.slice(0, maxRecentTracks - 1),
      ];

      // If we've played most tracks recently, just avoid the current track
      const tracksToAvoid =
        recentTracksToAvoid.length >= currentPlaylist.tracks.length - 1
          ? [currentTrackIndex]
          : recentTracksToAvoid;

      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      } while (tracksToAvoid.includes(nextIndex) && currentPlaylist.tracks.length > 1);

      return nextIndex;
    }

    return (currentTrackIndex + 1) % currentPlaylist.tracks.length;
  }, [currentPlaylist, currentTrackIndex, shuffle, recentlyPlayed]);

  const getPreviousTrackIndex = useCallback(() => {
    if (!currentPlaylist) return 0;

    if (shuffle) {
      let prevIndex: number;
      do {
        prevIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      } while (prevIndex === currentTrackIndex && currentPlaylist.tracks.length > 1);
      return prevIndex;
    }

    return currentTrackIndex === 0
      ? currentPlaylist.tracks.length - 1
      : currentTrackIndex - 1;
  }, [currentPlaylist, currentTrackIndex, shuffle]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled) return;

    const nextIndex = getNextTrackIndex();
    const nextTrack_ = currentPlaylist.tracks[nextIndex] || null;

    // Update recently played history
    setRecentlyPlayed(prev => [currentTrackIndex, ...prev.slice(0, 4)]); // Keep last 5
    setCurrentTrack(nextTrack_);
    setCurrentTrackIndex(nextIndex);
  }, [currentPlaylist, getNextTrackIndex, isEnabled, currentTrackIndex]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled || shuffle) return; // Disabled in shuffle mode

    const prevIndex = getPreviousTrackIndex();
    const prevTrack = currentPlaylist.tracks[prevIndex] || null;

    // Update recently played history
    setRecentlyPlayed(prev => [currentTrackIndex, ...prev.slice(0, 4)]); // Keep last 5
    setCurrentTrack(prevTrack);
    setCurrentTrackIndex(prevIndex);
  }, [currentPlaylist, getPreviousTrackIndex, isEnabled, currentTrackIndex, shuffle]);

  const toggleShuffle = useCallback(() => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    setPrefs({shuffle: newShuffle});
  }, [shuffle, setPrefs]);

  const selectPlaylist = useCallback(
    (playlist: Playlist) => {
      setCurrentPlaylist(playlist);
      setCurrentTrack(playlist.tracks[0] || null);
      setCurrentTrackIndex(0);
      setRecentlyPlayed([]); // Clear history when changing playlists
      setPrefs({defaultPlaylistId: playlist.id});
    },
    [setPrefs]
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
    shuffle,
    isEnabled,
    isLoading,
    currentTime,
    currentTrackDuration,
    isExpanded,
    playlists: DEFAULT_PLAYLISTS,
    togglePlayPause,
    nextTrack,
    previousTrack,
    toggleShuffle,
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
