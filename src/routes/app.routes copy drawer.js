import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';

const AppDrawer = createDrawerNavigator();

export default function AppRoutes() {
 return (
  <AppDrawer.Navigator
  screenOptions={{
    //DRAWER STYLES ==========================================
    drawerStyle: {
      backgroundColor: '#ccc',
      width: 240,
      borderTopRightRadius: 10
    },
    drawerActiveTintColor: 'white',
    drawerActiveBackgroundColor: '#C1ADA9',
    drawerInactiveTintColor: '#ccc',
    drawerInactiveBackgroundColor: '#888',
    drawerItemStyle: {
      borderRadius: 10,
    },
    drawerLabelStyle: {
      fontSize: 16,
    },
    drawerPosition: 'left', //left, right
    drawerType: 'front', //front, back, slide, permanent
    //drawerHideStatusBarOnOpen: 'true',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    /*sceneContainerStyle: {
      backgroundColor: 'red'
    }*/
    // FIM DRAWER STYLES ==========================================
    // ************************************************************
    // HEADER STYLES ==============================================
    headerStyle: {
      //height: 50, // Altura
      backgroundColor: 'rgba(0,0,0,0.0)'
    },
    headerShown: true,
    // FIM HEADER STYLES ==========================================
  }}
  
  >
    <AppDrawer.Screen
    name='Home' 
    component={Home}
    />
    <AppDrawer.Screen
    name='Home2' 
    component={Home}
    />
  </AppDrawer.Navigator>
  );
}