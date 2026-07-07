import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
// 1. Theme context type
type ThemeContextType = {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isLoading: boolean;
};

// 2. Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDark: true, // default to dark mode to prevent white flash
  setIsDark: () => {},
  isLoading: true,
});

const THEME_STORAGE_KEY = '@revibe_theme_preference';

// 3. Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDarkState] = useState(true); // Start with dark to prevent flash
  const [isLoading, setIsLoading] = useState(true);

  // Force dark mode
  useEffect(() => {
    setIsDarkState(true);
    setIsLoading(false);
  }, []);

  // Function to set theme (no-op since always dark)
  const setIsDark = async (value: boolean) => {
    // Intentionally empty, we want to stay in dark mode forever
  };

  // Update status bar when theme changes
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(isDark ? '#1a1a1a' : '#ffffff', true);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Hook to use theme context
export const useTheme = () => useContext(ThemeContext);
