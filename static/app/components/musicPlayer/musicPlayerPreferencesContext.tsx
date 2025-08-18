import {createContext, useCallback, useContext, useState} from 'react';

import type {
  MusicPlayerPrefs,
  MusicPlayerPrefsStrategy,
} from 'sentry/components/musicPlayer/musicPlayerPreferences';
import {StaticMusicPlayerPreferences} from 'sentry/components/musicPlayer/musicPlayerPreferences';

type ContextType = [MusicPlayerPrefs, (prefs: Partial<MusicPlayerPrefs>) => void];

const StateContext = createContext<ContextType>([
  StaticMusicPlayerPreferences.get(),
  () => {},
]);

export function MusicPlayerPreferencesContextProvider({
  children,
  prefsStrategy,
}: {
  children: React.ReactNode;
  prefsStrategy: MusicPlayerPrefsStrategy;
}) {
  const [state, setState] = useState<MusicPlayerPrefs>(() => prefsStrategy.get());

  const setPrefs = useCallback(
    (config: Partial<MusicPlayerPrefs>) => {
      const updated = {
        ...prefsStrategy.get(),
        ...config,
      };
      prefsStrategy.set(updated);
      setState(updated);
    },
    [prefsStrategy]
  );

  return <StateContext value={[state, setPrefs]}>{children}</StateContext>;
}

export function useMusicPlayerPrefs() {
  return useContext(StateContext);
}
