import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cadastrar from '../../pages/Cadastrar';
import Feather from 'react-native-vector-icons/Feather';


const Stack = createStackNavigator();

export default function StackScreen() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name='CadastrarStack' component={Cadastrar} />

    </Stack.Navigator>
  );
}