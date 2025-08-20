import {useMemo} from 'react';

import {useLocation} from 'sentry/utils/useLocation';

export type Product = {
  icon: string;
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
};

// Map URL paths to product information
const productMap: Record<string, Product> = {
  issues: {
    id: 'issues',
    name: 'Issues',
    icon: '🐛',
    theme: {
      primaryColor: '#dc2626', // Red
      secondaryColor: '#ea580c', // Orange
    },
  },
  replays: {
    id: 'replays',
    name: 'Replays',
    icon: '🎬',
    theme: {
      primaryColor: '#6366f1', // Indigo
      secondaryColor: '#8b5cf6', // Purple
    },
  },
  performance: {
    id: 'performance',
    name: 'Performance',
    icon: '⚡',
    theme: {
      primaryColor: '#059669', // Emerald
      secondaryColor: '#0d9488', // Teal
    },
  },
  feedback: {
    id: 'feedback',
    name: 'User Feedback',
    icon: '💬',
    theme: {
      primaryColor: '#0891b2', // Cyan
      secondaryColor: '#0ea5e9', // Sky
    },
  },
  discover: {
    id: 'discover',
    name: 'Discover',
    icon: '🔬',
    theme: {
      primaryColor: '#be185d', // Pink
      secondaryColor: '#ec4899', // Pink
    },
  },
  insights: {
    id: 'insights',
    name: 'Insights',
    icon: '🧠',
    theme: {
      primaryColor: '#7c2d12', // Brown
      secondaryColor: '#92400e', // Brown
    },
  },
  alerts: {
    id: 'alerts',
    name: 'Alerts',
    icon: '🚨',
    theme: {
      primaryColor: '#dc2626', // Red
      secondaryColor: '#ef4444', // Red
    },
  },
  dashboards: {
    id: 'dashboards',
    name: 'Dashboards',
    icon: '📈',
    theme: {
      primaryColor: '#7c3aed', // Violet
      secondaryColor: '#a855f7', // Purple
    },
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: '📁',
    theme: {
      primaryColor: '#2563eb', // Blue
      secondaryColor: '#3b82f6', // Blue
    },
  },
  traces: {
    id: 'traces',
    name: 'Traces',
    icon: '🔍',
    theme: {
      primaryColor: '#9333ea', // Purple
      secondaryColor: '#a855f7', // Purple
    },
  },
  logs: {
    id: 'logs',
    name: 'Logs',
    icon: '📝',
    theme: {
      primaryColor: '#0d9488', // Teal
      secondaryColor: '#14b8a6', // Teal
    },
  },
  profiles: {
    id: 'profiling',
    name: 'Profiling',
    icon: '📊',
    theme: {
      primaryColor: '#0d9488', // Teal
      secondaryColor: '#14b8a6', // Teal
    },
  },
  explore: {
    id: 'explore',
    name: 'Explore',
    icon: '🔬',
    theme: {
      primaryColor: '#be185d', // Pink
      secondaryColor: '#ec4899', // Pink
    },
  },
  releases: {
    id: 'releases',
    name: 'Releases',
    icon: '🚀',
    theme: {
      primaryColor: '#f59e0b', // Amber
      secondaryColor: '#fbbf24', // Yellow
    },
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    theme: {
      primaryColor: '#6b7280', // Gray
      secondaryColor: '#9ca3af', // Gray
    },
  },
  crons: {
    id: 'crons',
    name: 'Cron Monitors',
    icon: '⏰',
    theme: {
      primaryColor: '#f59e0b', // Amber
      secondaryColor: '#fbbf24', // Yellow
    },
  },
  uptime: {
    id: 'uptime',
    name: 'Uptime',
    icon: '📊',
    theme: {
      primaryColor: '#16a34a', // Green
      secondaryColor: '#22c55e', // Green
    },
  },
  frontend: {
    id: 'frontend',
    name: 'Frontend Insights',
    icon: '🎨',
    theme: {
      primaryColor: '#ec4899', // Pink
      secondaryColor: '#f472b6', // Pink
    },
  },
  backend: {
    id: 'backend',
    name: 'Backend Insights',
    icon: '⚙️',
    theme: {
      primaryColor: '#0d9488', // Teal
      secondaryColor: '#14b8a6', // Teal
    },
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile Insights',
    icon: '📱',
    theme: {
      primaryColor: '#8b5cf6', // Purple
      secondaryColor: '#a855f7', // Purple
    },
  },
  'ai-agents': {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: '🤖',
    theme: {
      primaryColor: '#059669', // Emerald
      secondaryColor: '#10b981', // Emerald
    },
  },
  agents: {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: '🤖',
    theme: {
      primaryColor: '#059669', // Emerald
      secondaryColor: '#10b981', // Emerald
    },
  },
};

// Helper function to get product from pathname
function getProductFromPathname(pathname: string): Product | null {
  if (!pathname) {
    return null;
  }

  // 1. Check for parent/subproduct patterns (with or without organizations)
  // This handles: /explore/replays, /insights/crons, /issues/replays, /issues/alerts, /organizations/sentry/explore/replays, etc.
  const parentSubproductMatch = pathname.match(
    /(?:\/organizations\/[^\/]+\/)?([^\/]+)\/([^\/]+)/
  );
  if (parentSubproductMatch?.[1] && parentSubproductMatch?.[2]) {
    const parentProduct = parentSubproductMatch[1];
    const subProduct = parentSubproductMatch[2];

    // First try to find the specific sub-product
    if (productMap[subProduct]) {
      return productMap[subProduct];
    }

    // If sub-product not found, fall back to parent product
    if (productMap[parentProduct]) {
      return productMap[parentProduct];
    }
  }

  // 2. Check for standalone products (with or without organizations)
  const standaloneMatch = pathname.match(/(?:\/organizations\/[^\/]+\/)?([^\/]+)/);
  if (standaloneMatch?.[1]) {
    const productName = standaloneMatch[1];
    if (productMap[productName]) {
      return productMap[productName];
    }
  }

  return null;
}

export function useCurrentProduct(): Product | null {
  const location = useLocation();

  return useMemo(() => {
    return getProductFromPathname(location?.pathname);
  }, [location?.pathname]);
}
