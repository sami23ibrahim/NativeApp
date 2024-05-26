import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUser from './src/components/CreateUser';
import LoginScreen from './src/screens/LoginScreen';
import { FIREBASE_AUTH } from './src/config/firebase';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

