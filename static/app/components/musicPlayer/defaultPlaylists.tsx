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
        src: '/_static/dist/sentry/assets/songs/error_code_blues.mp3',
      },
      {
        id: 'bufo-journey',
        title: "Bufo's Journey",
        artist: 'Bufo',
        src: '/_static/dist/sentry/assets/songs/bufo_journey.mp3',
      },
      {
        id: 'error-slayer',
        title: 'Error Slayer',
        artist: 'Sentaur',
        src: '/_static/dist/sentry/assets/songs/error_slayer.mp3',
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
        title: 'Debugging Zen',
        artist: 'Craft Master',
        src: '/_static/dist/sentry/assets/songs/debugging_zen.mp3',
      },
      {
        id: 'minecraft-2',
        title: 'Redstone Circuit',
        artist: 'Pixel Builder',
        src: '/_static/dist/sentry/assets/songs/redstone_circuit.mp3',
      },
    ],
  },
];

// Shuffle tracks within each playlist once on module load, then keep them in that order for the session
export const DEFAULT_PLAYLISTS: Playlist[] = BASE_PLAYLISTS.map(playlist => ({
  ...playlist,
  tracks: [...playlist.tracks].sort(() => Math.random() - 0.5),
}));
