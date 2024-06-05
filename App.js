// import 'react-native-gesture-handler';

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './src/screens/LoginScreen';
// import CategoryListScreen from './src/screens/CategoryListScreen';
// import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
// import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
// import { FIREBASE_AUTH } from './src/config/firebase';
// import { auth } from './src/config/firebase';
// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <MenuProvider>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="My Categories" component={CategoryDetailScreen} />
//         <Stack.Screen name="LogOut" component={CategoryListScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//     </MenuProvider>
//   );
// }



// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './src/screens/LoginScreen';
// import CategoryListScreen from './src/screens/CategoryListScreen';
// import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
// import HomeScreen from './src/screens/HomeScreen'; // Import the HomeScreen
// import { MenuProvider } from 'react-native-popup-menu';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <MenuProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login">
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="My Categories" component={CategoryDetailScreen} />
//           <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
//           <Stack.Screen name="Home" component={HomeScreen} /> 
//         </Stack.Navigator>
//       </NavigationContainer>
//     </MenuProvider>
//   );
// }





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
const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
          <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ManageTeam" component={ManageTeamScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
