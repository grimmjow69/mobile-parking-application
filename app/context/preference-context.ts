import React, { createContext } from 'react';

export const PreferencesContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  language: 'en',
  setLanguage: (lang: string) => {},
  user: null,
  setUser: (user: any) => {}
});
