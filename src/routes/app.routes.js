import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Feather from 'react-native-vector-icons/Feather';
import HomeStack from './homeStackRoutes';

const AppTab = createBottomTabNavigator();

export default function AppRoutes() {

  // function StackScreen() {
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen name='Home' component={Home} />
  //     </Stack.Navigator>
  //   );
  // }

 return (
  <AppTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarLabelStyle: {
        fontSize: 16
      },
      tabBarIconStyle: {
        marginTop: 3
      }
    }}
  >

    <AppTab.Screen name='Perfil' component={HomeStack}
    options={{
      tabBarIcon: ({color, size}) => {
        return <Feather name='user' color={color} size={size}/>
      }
    }}/>

    <AppTab.Screen name='Cadastrar' component={Home}
    options={{
      tabBarIcon: ({color, size}) => {
        return <Feather name='book-open' color={color} size={size}/>
      }
    }}/>

    <AppTab.Screen name='Procurar' component={Home}
    options={{
      tabBarIcon: ({color, size}) => {
        return <Feather name='map' color={color} size={size}/>
      }
    }}/>

    <AppTab.Screen name='Mensagens' component={Home}
    options={{
      tabBarIcon: ({color, size}) => {
        return <Feather name='message-circle' color={color} size={size}/>
      }
    }}/>

  </AppTab.Navigator>
  );
}