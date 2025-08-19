import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';

// Map of product IDs to their inspired tracks
export const PRODUCT_TRACKS: Record<string, Track[]> = {
  // Main products from productMap
  issues: [
    {
      id: 'issues-placeholder',
      title: 'lBug Hunt Blues',
      artist: 'Debug Detective',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  replays: [
    {
      id: 'replays-placeholder',
      title: 'lRewind & Replay',
      artist: 'Session Detective',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
      id: 'feedback-placeholder',
      title: 'lUser Voice',
      artist: 'Feedback Loop',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
      id: 'insights-placeholder',
      title: 'lMind Reader',
      artist: 'Analytics Wizard',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  alerts: [
    {
      id: 'alerts-placeholder',
      title: 'lWake Up Call',
      artist: 'Alert Manager',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  dashboards: [
    {
      id: 'dashboards-placeholder',
      title: 'lChart Topper',
      artist: 'Data Visualizer',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
      id: 'releases-placeholder',
      title: 'lShip It',
      artist: 'Release Captain',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  settings: [
    {
      id: 'settings-placeholder',
      title: 'lConfiguration Station',
      artist: 'Settings Master',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],

  // Insights sub-products from insightsMap
  crons: [
    {
      id: 'crons-placeholder',
      title: 'lTick Tock Clock',
      artist: 'Cron Commander',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
      id: 'frontend-placeholder',
      title: 'lUI Symphony',
      artist: 'Frontend Maestro',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  backend: [
    {
      id: 'backend-placeholder',
      title: 'lServer Side Story',
      artist: 'Backend Boss',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  mobile: [
    {
      id: 'mobile-placeholder',
      title: 'lPocket Symphony',
      artist: 'Mobile Maestro',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  'ai-agents': [
    {
      id: 'ai-agents-placeholder',
      title: 'lRobot Rock',
      artist: 'AI Assistant',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
    },
  ],
  // Note: 'agents' maps to the same as 'ai-agents' in insightsMap
  agents: [
    {
      id: 'agents-placeholder',
      title: 'lRobot Rock',
      artist: 'AI Assistant',
      src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
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
