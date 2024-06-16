
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import CategoryListScreen from './src/screens/CategoryListScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import HomeScreen from './src/screens/HomeScreen'; // Import the HomeScreen
import ManageTeamScreen from './src/screens/ManageTeamScreen'; // Import the ManageTeamScreen
import { MenuProvider } from 'react-native-popup-menu';
import SignupScreen from './src/screens/SignupScreen';
import UserSettingsScreen from './src/screens/UserSettingsScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen'; // replace with your actual home screen component
import { name as appName } from './app.json';
const Stack = createStackNavigator();
AppRegistry.registerComponent(appName, () => App);
export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
      <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#9cacbc', // Background color of the header
            },
            headerTintColor: '#fff', // Color of the header text and back button
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false, // Remove shadow
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
          <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ManageTeam" component={ManageTeamScreen} /> 
          <Stack.Screen name="UserSettingsScreen" component={UserSettingsScreen} /> 
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
