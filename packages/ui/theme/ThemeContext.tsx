import React, { createContext, useContext, useState, useEffect } from 'react';
import { Colors, getThemeColors } from './colors';

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextType {
  mode: ThemeMode;
  colors: Colors;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colors: getThemeColors('dark'),
  toggleTheme: () => {},
  setMode: () => {},
});

const STORAGE_KEY = 'devdepth_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const currentColors = getThemeColors(mode);

  return (
    <ThemeContext.Provider value={{ mode, colors: currentColors, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
