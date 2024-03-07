import { createContext } from 'react';
import { UserData } from '../models/user';

interface PreferencesContextProps {
  toggleTheme: () => void;
  isThemeDark: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

export const PreferencesContext = createContext<PreferencesContextProps>({
  toggleTheme: () => {},
  isThemeDark: false,
  language: 'en',
  setLanguage: (lang: string) => {},
  user: null,
  setUser: (user: UserData | null) => {}
});
