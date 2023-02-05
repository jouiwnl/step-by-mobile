import React, { useState } from 'react';

import { 
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';

import { Loading } from './src/components/Loading';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { auth } from './firebase';
import { User } from 'firebase/auth';
import { ScreenThemeProvider } from './src/contexts/ScreenTheme';
import Main from './src/screens/Main';

export default function App() {
  const [user, setUser] = useState<User | null>();
  const [stateChanged, setStateChanged] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    auth.onAuthStateChanged(response => {
      setStateChanged(true)
      
      if (auth.currentUser) {
        setUser(response);
      }
    })

    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1500)
  }, [user])

  if (!fontsLoaded || !stateChanged) {
    return (
      <Loading />
    );
  }

  return (
    <ScreenThemeProvider>
      <Main />
    </ScreenThemeProvider>
  );
}