import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {useMusicPlayerPrefs} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';

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
  seek: (time: number) => void;
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
  historyPosition: 0,
  listeningHistory: [],
  playlists: [],
  togglePlayPause: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seek: () => {},
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
        src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
      },
      {
        id: 'synth-2',
        title: 'Binary Sunset',
        artist: 'Pixel Prophet',
        src: 'https://www.soundjay.com/free-music/sounds/barn-beat-01.mp3',
      },
      {
        id: 'synth-3',
        title: 'Neon Nights',
        artist: 'Cyber Coder',
        src: 'https://www.soundjay.com/free-music/sounds/cautious-path-01.mp3',
      },
      {
        id: 'synth-4',
        title: 'Data Stream',
        artist: 'Binary Bot',
        src: 'https://www.soundjay.com/free-music/sounds/heart-of-the-sea-01.mp3',
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
        src: 'https://www.soundjay.com/free-music/sounds/iron-man-01.mp3',
      },
      {
        id: 'metal-2',
        title: 'Memory Leak',
        artist: 'Segmentation Fault',
        src: 'https://www.soundjay.com/free-music/sounds/destination-01.mp3',
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
        title:
          'Block by Block by Block by Block by Block by Block by Block by Block by Block by Block by Block by Block',
        artist: 'Craft Master',
        src: 'https://www.soundjay.com/free-music/sounds/cautious-path-01.mp3',
      },
      {
        id: 'minecraft-2',
        title: 'Redstone Circuit',
        artist: 'Pixel Builder',
        src: 'https://www.soundjay.com/free-music/sounds/heart-of-the-sea-01.mp3',
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
  const wasPlayingRef = useRef(false);
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
  const [listeningHistory, setListeningHistory] = useState<number[]>([]);
  const [historyPosition, setHistoryPosition] = useState(0); // 0 means we're at the most recent track

  // Keep track of playing state for auto-resume
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

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

    if (shuffle) {
      // Avoid recently played tracks (last 3 tracks or half the playlist, whichever is smaller)
      const maxRecentTracksToAvoid = Math.min(
        3,
        Math.floor(currentPlaylist.tracks.length / 2)
      );
      const tracksToAvoid = [
        currentTrackIndex,
        ...listeningHistory.slice(0, maxRecentTracksToAvoid - 1),
      ];

      // If we've played most tracks recently, just avoid the current track
      const finalTracksToAvoid =
        tracksToAvoid.length >= currentPlaylist.tracks.length - 1
          ? [currentTrackIndex]
          : tracksToAvoid;

      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      } while (
        finalTracksToAvoid.includes(nextIndex) &&
        currentPlaylist.tracks.length > 1
      );

      return nextIndex;
    }

    return (currentTrackIndex + 1) % currentPlaylist.tracks.length;
  }, [currentPlaylist, currentTrackIndex, shuffle, listeningHistory]);

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

    // We're at the top of the stack (position 0), get a new track and add to stack
    const nextIndex = getNextTrackIndex();
    const nextTrack_ = currentPlaylist.tracks[nextIndex] || null;

    // Push new track to top of stack, keep max 10 items
    const maxHistoryLength = 10;
    setListeningHistory(prev => [nextIndex, ...prev.slice(0, maxHistoryLength - 1)]);
    setHistoryPosition(0); // Stay at top of stack
    setCurrentTrack(nextTrack_);
    setCurrentTrackIndex(nextIndex);
  }, [currentPlaylist, getNextTrackIndex, isEnabled, historyPosition, listeningHistory]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !isEnabled) return;

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
  }, [currentPlaylist, isEnabled, historyPosition, listeningHistory]);

  const toggleShuffle = useCallback(() => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    setPrefs({shuffle: newShuffle});
  }, [shuffle, setPrefs]);

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

      // If shuffle is on, start with a random track; otherwise start with first track
      const startIndex =
        shuffle && playlist.tracks.length > 0
          ? Math.floor(Math.random() * playlist.tracks.length)
          : 0;

      setCurrentTrack(playlist.tracks[startIndex] || null);
      setCurrentTrackIndex(startIndex);
      setListeningHistory([startIndex]); // Initialize history with starting track
      setHistoryPosition(0); // Start at top of stack
    },
    [shuffle]
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
    historyPosition,
    listeningHistory,
    playlists: DEFAULT_PLAYLISTS,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
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
