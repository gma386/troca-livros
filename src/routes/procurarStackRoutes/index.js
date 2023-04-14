import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Procurar from '../../pages/Procurar';
import Feather from 'react-native-vector-icons/Feather';

const Stack = createStackNavigator();

export default function StackScreen() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name='ProcurarStack' component={Procurar} />
    </Stack.Navigator>
  );
}