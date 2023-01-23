import './src/lib/dayjs';
import React, { useState } from 'react';

import { StatusBar } from 'react-native';
import { 
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexts/Auth';
import { auth } from './firebase';
import { User } from 'firebase/auth';

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
    <AuthProvider>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </AuthProvider>
  );
}