import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../pages/Home';
import Feather from 'react-native-vector-icons/Feather';

const Stack = createStackNavigator();

export default function StackScreen() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
}