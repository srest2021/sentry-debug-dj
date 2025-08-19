import type {Playlist} from 'sentry/components/musicPlayer/musicPlayerContext';

const BASE_PLAYLISTS: Playlist[] = [
  {
    // Sentry-themed playlist
    id: 'sentaur-setlist',
    name: 'Sentaur Setlist',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
    },
    tracks: [
      {
        id: 'error-code-blues',
        title: 'Error Code Blues',
        artist: 'Sentaur',
        src: 'https://files.catbox.moe/dy3bzy.mp3',
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

// Shuffle tracks within each playlist once on module load, then keep them in that order for the session
export const DEFAULT_PLAYLISTS: Playlist[] = BASE_PLAYLISTS.map(playlist => ({
  ...playlist,
  tracks: [...playlist.tracks].sort(() => Math.random() - 0.5),
}));
