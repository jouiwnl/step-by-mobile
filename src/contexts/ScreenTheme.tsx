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

  useEffect(() => {
    AsyncStorage.getItem('dark').then(value => {
      if (!!value) {
        setDark(!!value)
      } else {
        setDark(true)
      }
    });
  }, [])

  useEffect(() => {
    if (dark) {
      AsyncStorage.setItem('dark', 'true');
    } else {
      AsyncStorage.setItem('dark', 'false');
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