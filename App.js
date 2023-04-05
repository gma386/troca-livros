import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Routes from './src/routes/index';
import { NavigationContainer } from '@react-navigation/native';
import AuthProvider from './src/context/auth';

export default function TrocaLivros() {
 return (
  <NavigationContainer>
    <AuthProvider>
      <StatusBar/>
      <Routes/>
    </AuthProvider>
  </NavigationContainer>



  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})