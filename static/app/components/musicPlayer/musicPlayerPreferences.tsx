import localStorage from 'sentry/utils/localStorage';

const LOCAL_STORAGE_KEY = 'music-player-config';

export type MusicPlayerPrefs = {
  defaultPlaylistId: string;
  isEnabled: boolean;
  shuffle: boolean;
};

const DEFAULT_PREFS: MusicPlayerPrefs = {
  isEnabled: true,
  defaultPlaylistId: 'debugging-beats',
  shuffle: false,
};

const DISABLED_PREFS: MusicPlayerPrefs = {
  isEnabled: false,
  defaultPlaylistId: 'debugging-beats',
  shuffle: false,
};

export interface MusicPlayerPrefsStrategy {
  _prefs: MusicPlayerPrefs;
  get: () => MusicPlayerPrefs;
  set: (prefs: MusicPlayerPrefs) => void;
}

export const StaticMusicPlayerPreferences: MusicPlayerPrefsStrategy = {
  _prefs: {...DEFAULT_PREFS},
  get() {
    return this._prefs;
  },
  set(prefs) {
    this._prefs = prefs;
  },
};

export const StaticDisabledMusicPlayerPreferences: MusicPlayerPrefsStrategy = {
  _prefs: {...DISABLED_PREFS},
  get() {
    return this._prefs;
  },
  set(prefs) {
    this._prefs = prefs;
  },
};

export const LocalStorageMusicPlayerPreferences: MusicPlayerPrefsStrategy = {
  _prefs: {...DEFAULT_PREFS},
  get() {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    return {...DEFAULT_PREFS, ...parsed};
  },
  set(prefs) {
    this._prefs = prefs;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
  },
};
