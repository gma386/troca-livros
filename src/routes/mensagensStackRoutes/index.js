import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Mensagens from '../../pages/Mensagens';
import Chat from '../../pages/Chat';

const Stack = createStackNavigator();

export default function StackScreen() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name='MensagensStack' component={Mensagens} />
      <Stack.Screen name='Chat' component={Chat} />
    </Stack.Navigator>
  );
}