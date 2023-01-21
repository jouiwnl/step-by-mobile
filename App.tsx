import './src/lib/dayjs';

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

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1500)
  }, [])

  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}