import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import CategoryListScreen from './src/screens/CategoryListScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { FIREBASE_AUTH } from './src/config/firebase';
import { auth } from './src/config/firebase';
const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MyCategories">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
        <Stack.Screen name="MyCategories" component={CategoryListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </MenuProvider>
  );
}



