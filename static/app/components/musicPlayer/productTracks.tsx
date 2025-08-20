import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';

// Map of product IDs to their inspired tracks
export const PRODUCT_TRACKS: Record<string, Track[]> = {
  issues: [
    {
      id: 'issues-1',
      title: 'Bug Hunt Blues',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/issues1.mp3',
    },
    {
      id: 'issues-2',
      title: 'Error Stack Hype',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/error_stack_hype.mp3',
    },
  ],
  replays: [
    {
      id: 'replays-1',
      title: 'Rewind & Replay',
      artist: 'Session Detective',
      src: '/_static/dist/sentry/assets/songs/replay1.mp3',
    },
    {
      id: 'replays-2',
      title: 'Agatha Christie Mystery',
      artist: 'Session Detective',
      src: '/_static/dist/sentry/assets/songs/session_shadows.mp3',
    },
  ],
  // performance: [
  //   {
  //     id: 'performance-placeholder',
  //     title: 'lLightning Fast',
  //     artist: 'Speed Optimizer',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  'issues/feedback': [
    {
      id: 'feedback-1',
      title: 'User Voice from the Depths',
      artist: 'Feedback Loop',
      src: '/_static/dist/sentry/assets/songs/feedback1.mp3',
    },
    {
      id: 'feedback-2',
      title: 'Feedback Symphony',
      artist: 'Tired Developer',
      src: '/_static/dist/sentry/assets/songs/feedback_symphony.mp3',
    },
  ],
  discover: [
    {
      id: 'discover-1',
      title: 'Queries in the Dark',
      artist: 'Query Carrie',
      src: '/_static/dist/sentry/assets/songs/queries_in_the_dark.mp3',
    },
    {
      id: 'discover-2',
      title: 'Into the Unknown',
      artist: 'Query Carrie',
      src: '/_static/dist/sentry/assets/songs/into_the_unknown.mp3',
    },
  ],
  insights: [
    {
      id: 'insights-1',
      title: 'Mind Reader',
      artist: 'Analytics Wizard',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  alerts: [
    {
      id: 'alerts-1',
      title: 'Wake Up Call',
      artist: 'Incident Captain',
      src: '/_static/dist/sentry/assets/songs/alerts1.mp3',
    },
    {
      id: 'alerts-2',
      title: 'Replay Count Failure',
      artist: 'Incident Captain',
      src: '/_static/dist/sentry/assets/songs/replay_count_failure.mp3',
    },
  ],
  dashboards: [
    {
      id: 'dashboards-1',
      title: 'Chart Topper',
      artist: 'Dashboard Diva',
      src: '/_static/dist/sentry/assets/songs/dashboards.mp3',
    },
    {
      id: 'dashboards-2',
      title: 'Data Love',
      artist: 'Dashboard Diva',
      src: '/_static/dist/sentry/assets/songs/data_love.mp3',
    },
  ],
  // projects: [
  //   {
  //     id: 'projects-placeholder',
  //     title: 'lProject Anthem',
  //     artist: 'Team Builder',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  traces: [
    {
      id: 'traces-1',
      title: 'Trace Maze',
      artist: 'Trace Detective',
      src: '/_static/dist/sentry/assets/songs/trace_maze.mp3',
    },
  ],
  logs: [
    {
      id: 'logs-1',
      title: 'Reading the Lines',
      artist: 'Country Boy Coder',
      src: '/_static/dist/sentry/assets/songs/reading_the_lines.mp3',
    },
  ],
  profiles: [
    {
      id: 'profiling-1',
      title: 'Heartbreak Algorithms',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/heartbreak_algorithms.mp3',
    },
  ],
  // explore: [
  //   {
  //     id: 'explore-placeholder',
  //     title: 'lAdventure Time',
  //     artist: 'Data Explorer',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  releases: [
    {
      id: 'releases-1',
      title: 'Ship It',
      artist: 'Release Captain',
      src: '/_static/dist/sentry/assets/songs/releases1.mp3',
    },
  ],
  settings: [
    {
      id: 'settings-1',
      title: 'Configuration Station',
      artist: 'Settings Master',
      src: '/_static/dist/sentry/assets/songs/settings1.mp3',
    },
  ],

  // Insights sub-products
  crons: [
    {
      id: 'crons-1',
      title: 'Tick Tock Clock',
      artist: 'Cron Commander',
      src: '/_static/dist/sentry/assets/songs/cron1.mp3',
    },
  ],
  uptime: [
    {
      id: 'uptime-1',
      title: 'Groove Patrol: Uptime Vibes',
      artist: 'Uptime Guardian',
      src: '/_static/dist/sentry/assets/songs/groove_patrol_uptime_vibes.mp3',
    },
  ],
  frontend: [
    {
      id: 'frontend-1',
      title: 'Shattered Speed Dreams',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/shattered_seconds.mp3',
    },
  ],
  backend: [
    {
      id: 'backend-1',
      title: 'Server Side Story',
      artist: 'Backend Boss',
      src: '/_static/dist/sentry/assets/songs/server_side_story.mp3',
    },
  ],
  mobile: [
    {
      id: 'mobile-1',
      title: 'App Ascension',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/app_ascension.mp3',
    },
  ],
  'ai-agents': [
    {
      id: 'ai-agents-1',
      title: 'Seer Speeds Ahead',
      artist: 'Seer',
      src: '/_static/dist/sentry/assets/songs/seer_speeds_ahead.mp3',
    },
  ],
  agents: [
    {
      id: 'ai-agents-1',
      title: 'Seer Speeds Ahead',
      artist: 'Seer',
      src: '/_static/dist/sentry/assets/songs/seer_speeds_ahead.mp3',
    },
  ],
};

/**
 * Get tracks for a given product ID
 */
export function getTracksForProduct(productId: string | undefined): Track[] {
  if (!productId) return [];
  return PRODUCT_TRACKS[productId] || [];
}
