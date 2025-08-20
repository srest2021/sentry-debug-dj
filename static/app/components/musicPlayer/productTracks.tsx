import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';

// Map of product IDs to their inspired tracks
export const PRODUCT_TRACKS: Record<string, Track[]> = {
  // Main products from productMap
  issues: [
    {
      id: 'issues-1',
      title: 'Bug Hunt Blues',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/issues1.mp3',
    },
  ],
  replays: [
    {
      id: 'replays-1',
      title: 'Rewind & Replay',
      artist: 'Session Detective',
      src: '/_static/dist/sentry/assets/songs/replay1.mp3',
    },
  ],
  performance: [
    {
      id: 'performance-placeholder',
      title: 'lLightning Fast',
      artist: 'Speed Optimizer',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  'issues/feedback': [
    {
      id: 'feedback-1',
      title: 'User Voice',
      artist: 'Feedback Loop',
      src: '/_static/dist/sentry/assets/songs/feedback1.mp3',
    },
    {
      id: 'feedback-2',
      title: 'Feedback Symphony',
      artist: 'Tired Developer',
      src: '/_static/dist/sentry/assets/songs/feedback2.mp3',
    },
  ],
  discover: [
    {
      id: 'discover-placeholder',
      title: 'lData Explorer',
      artist: 'Query Master',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
      artist: 'Alert Manager',
      src: '/_static/dist/sentry/assets/songs/alerts1.mp3',
    },
  ],
  dashboards: [
    {
      id: 'dashboards-1',
      title: 'Chart Topper',
      artist: 'Data Visualizer',
      src: '/_static/dist/sentry/assets/songs/dashboards.mp3',
    },
  ],
  projects: [
    {
      id: 'projects-placeholder',
      title: 'lProject Anthem',
      artist: 'Team Builder',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  traces: [
    {
      id: 'traces-placeholder',
      title: 'lFollow the Trail',
      artist: 'Trace Detective',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  logs: [
    {
      id: 'logs-placeholder',
      title: 'lLog Jam',
      artist: 'Text Parser',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  profiling: [
    {
      id: 'profiling-placeholder',
      title: 'lProfile Picture',
      artist: 'Performance Profiler',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  explore: [
    {
      id: 'explore-placeholder',
      title: 'lAdventure Time',
      artist: 'Data Explorer',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
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

  // Insights sub-products from insightsMap
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
      id: 'uptime-placeholder',
      title: 'lAlways Online',
      artist: 'Uptime Guardian',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  frontend: [
    {
      id: 'frontend-1',
      title: 'UI Symphony',
      artist: 'Frontend Maestro',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  backend: [
    {
      id: 'backend-1',
      title: 'Server Side Story',
      artist: 'Backend Boss',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  mobile: [
    {
      id: 'mobile-1',
      title: 'Pocket Symphony',
      artist: 'Mobile Maestro',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  'ai-agents': [
    {
      id: 'ai-agents-1',
      title: 'Robot Rock',
      artist: 'AI Assistant',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  // Note: 'agents' maps to the same as 'ai-agents' in insightsMap
  agents: [
    {
      id: 'agents-1',
      title: 'Robot Rock',
      artist: 'AI Assistant',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
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
