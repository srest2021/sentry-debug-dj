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

// Helper function to get product from pathname
function getProductFromPathname(pathname: string): Product | null {
  if (!pathname) {
    return null;
  }

  // Extract organization slug and product from pathname
  // Paths are typically: /organizations/{orgSlug}/{product}/
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts.length < 3 || pathParts[0] !== 'organizations') {
    return null;
  }

  const productPath = pathParts[2];

  if (!productPath) {
    return null;
  }

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
    profiling: {
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
  };

  // Check for insights sub-paths (crons, uptime)
  if (pathname.includes('/insights/crons/')) {
    return {
      id: 'crons',
      name: 'Cron Monitors',
      icon: '⏰',
      theme: {
        primaryColor: '#f59e0b', // Amber
        secondaryColor: '#fbbf24', // Yellow
      },
    };
  }

  if (pathname.includes('/insights/uptime/')) {
    return {
      id: 'uptime',
      name: 'Uptime Monitors',
      icon: '📊',
      theme: {
        primaryColor: '#16a34a', // Green
        secondaryColor: '#22c55e', // Green
      },
    };
  }

  if (pathname.includes('/insights/frontend/')) {
    return {
      id: 'frontend',
      name: 'Frontend Insights',
      icon: '🎨',
      theme: {
        primaryColor: '#ec4899', // Pink
        secondaryColor: '#f472b6', // Pink
      },
    };
  }

  if (pathname.includes('/insights/backend/')) {
    return {
      id: 'backend',
      name: 'Backend Insights',
      icon: '⚙️',
      theme: {
        primaryColor: '#0d9488', // Teal
        secondaryColor: '#14b8a6', // Teal
      },
    };
  }

  if (pathname.includes('/insights/mobile/')) {
    return {
      id: 'mobile',
      name: 'Mobile Insights',
      icon: '📱',
      theme: {
        primaryColor: '#8b5cf6', // Purple
        secondaryColor: '#a855f7', // Purple
      },
    };
  }

  if (
    pathname.includes('/insights/ai-agents/') ||
    pathname.includes('/insights/agents/')
  ) {
    return {
      id: 'ai-agents',
      name: 'AI Agents',
      icon: '🤖',
      theme: {
        primaryColor: '#059669', // Emerald
        secondaryColor: '#10b981', // Emerald
      },
    };
  }

  return productMap[productPath] || null;
}

export function useCurrentProduct(): Product | null {
  const location = useLocation();

  return useMemo(() => {
    return getProductFromPathname(location?.pathname);
  }, [location?.pathname]);
}
