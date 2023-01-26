import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { Routes } from '../routes';
import { AuthProvider } from '../contexts/Auth';
import { ScreenThemeContext } from '../contexts/ScreenTheme';

export default function Main() {

  const { dark } = useContext(ScreenThemeContext);

  return (
    <AuthProvider>
      <Routes />
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
    </AuthProvider>
  );
}