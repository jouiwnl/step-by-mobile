import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

export interface ScreenThemeContextProps {
  dark?: boolean;
  handleDarkMode?: () => void;
}

export const ScreenThemeContext = createContext<ScreenThemeContextProps>({});

export function ScreenThemeProvider({ children }: any) {
  const [dark, setDark] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === 'dark' || !value) {
        setDark(true)
      } else {
        setDark(false)
      }
    });
  }, [])

  useEffect(() => {
    if (dark) {
      AsyncStorage.setItem('theme', 'dark');
    } else {
      AsyncStorage.setItem('theme', 'light');
    }
  }, [dark])

  function handleDarkMode() {
    setDark(!dark)
  }

  return (
    <ScreenThemeContext.Provider value={{
      dark,
      handleDarkMode
    }}>
      {children}
    </ScreenThemeContext.Provider>
  )
}