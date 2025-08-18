import MusicPlayer from 'sentry/components/musicPlayer/musicPlayer';
import {MusicPlayerProvider} from 'sentry/components/musicPlayer/musicPlayerContext';
import {LocalStorageMusicPlayerPreferences} from 'sentry/components/musicPlayer/musicPlayerPreferences';
import {MusicPlayerPreferencesContextProvider} from 'sentry/components/musicPlayer/musicPlayerPreferencesContext';

type Props = {
  children: React.ReactNode;
};

export default function MusicPlayerWrapper({children}: Props) {
  return (
    <MusicPlayerPreferencesContextProvider
      prefsStrategy={LocalStorageMusicPlayerPreferences}
    >
      <MusicPlayerProvider>
        {children}
        <MusicPlayer />
      </MusicPlayerProvider>
    </MusicPlayerPreferencesContextProvider>
  );
}
