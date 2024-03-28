import { createContext } from 'react';
import { UserData } from '../models/user';

export interface PreferencesContextProps {
  switchTheme: () => void;
  isThemeDark: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  alertNotifications: boolean;
  switchAlertNotifications: () => void;
}

export const PreferencesContext = createContext<PreferencesContextProps>({
  switchTheme: () => {},
  isThemeDark: false,
  language: 'en',
  setLanguage: (lang: string) => {},
  user: null,
  setUser: (user: UserData | null) => {},
  alertNotifications: true,
  switchAlertNotifications: () => {}
});
