
// import { AppRegistry } from 'react-native';
// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './src/screens/LoginScreen';
// import CategoryListScreen from './src/screens/CategoryListScreen';
// import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
// import HomeScreen from './src/screens/HomeScreen'; // Import the HomeScreen
// import ManageTeamScreen from './src/screens/ManageTeamScreen'; // Import the ManageTeamScreen
// import { MenuProvider } from 'react-native-popup-menu';
// import SignupScreen from './src/screens/SignupScreen';
// import UserSettingsScreen from './src/screens/UserSettingsScreen';
// import PasswordResetScreen from './src/screens/PasswordResetScreen'; // replace with your actual home screen component
// import { name as appName } from './app.json';
// import { NotificationProvider } from './src/components/NotificationContext'; // Import the NotificationProvider
// import NotificationTestScreen from './src/screens/NotificationTestScreen'; 
// const Stack = createStackNavigator();
// AppRegistry.registerComponent(appName, () => App);
// export default function App() {
//   return (
//     <NotificationProvider>
//       <MenuProvider>
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Login"
//             screenOptions={{
//               headerStyle: { backgroundColor: '#9cacbc' },
//               headerTintColor: '#fff',
//               headerTitleStyle: { fontWeight: 'bold' },
//               headerShadowVisible: false,
//             }}
//           >
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//             <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
//             <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
//             <Stack.Screen name="UserSettingsScreen" component={UserSettingsScreen} />
//             <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
//             <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />

//           </Stack.Navigator>
//         </NavigationContainer>
//       </MenuProvider>
//     </NotificationProvider>
//   );
// }


// import { AppRegistry } from 'react-native';
// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './src/screens/LoginScreen';
// import CategoryListScreen from './src/screens/CategoryListScreen';
// import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
// import HomeScreen from './src/screens/HomeScreen'; // Import the HomeScreen
// import ManageTeamScreen from './src/screens/ManageTeamScreen'; // Import the ManageTeamScreen
// import { MenuProvider } from 'react-native-popup-menu';
// import SignupScreen from './src/screens/SignupScreen';
// import UserSettingsScreen from './src/screens/UserSettingsScreen';
// import PasswordResetScreen from './src/screens/PasswordResetScreen'; // replace with your actual home screen component
// import { name as appName } from './app.json';
// import { NotificationProvider } from './src/components/NotificationProvider'; // Import the NotificationProvider
// import NotificationTestScreen from './src/screens/NotificationTestScreen'; 
// import NotificationBadge from './src/components/NotificationBadge'; // Ensure this import is correct
// import { useRoute } from '@react-navigation/native';
// const Stack = createStackNavigator();

// AppRegistry.registerComponent(appName, () => App);

// export default function App() {
//   return (
//     <NotificationProvider>
//       <MenuProvider>
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Login"
//             screenOptions={({ navigation }) => ({
//               headerStyle: { backgroundColor: '#9cacbc' },
//               headerTintColor: '#fff',
//               headerTitleStyle: { fontWeight: 'bold' },
//               headerShadowVisible: false,
            
//             })}
//           >
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//             <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
//             <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
//             <Stack.Screen name="UserSettingsScreen" component={UserSettingsScreen} />
//             <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
//             <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </MenuProvider>
//     </NotificationProvider>
//   );
// }


// import { AppRegistry } from 'react-native';
// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './src/screens/LoginScreen';
// import CategoryListScreen from './src/screens/CategoryListScreen';
// import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import ManageTeamScreen from './src/screens/ManageTeamScreen';
// import { MenuProvider } from 'react-native-popup-menu';
// import SignupScreen from './src/screens/SignupScreen';
// import UserSettingsScreen from './src/screens/UserSettingsScreen';
// import PasswordResetScreen from './src/screens/PasswordResetScreen';
// import { name as appName } from './app.json';
// import { NotificationProvider } from './src/components/NotificationProvider';
// import NotificationTestScreen from './src/screens/NotificationTestScreen';
// import HeaderIcons from './src/components/HeaderIcons'; // Import the HeaderIcons component
// import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth

// import UpdateEmailScreen from './src/screens/UpdateEmailScreen'; // Correct import for default export
// import ChangePasswordScreen from './src/screens/ChangePasswordScreen'; // Correct import for default export
// import DeleteAccountScreen from './src/screens/DeleteAccountScreen'; // Correct import for default export


// const Stack = createStackNavigator();
// const auth = getAuth();

// AppRegistry.registerComponent(appName, () => App);

// export default function App() {
//   const handleSignOut = async (navigation) => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <NotificationProvider>
//       <MenuProvider>
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Login"
//             screenOptions={({ navigation }) => ({
//               headerStyle: { backgroundColor: '#9cacbc' },
//               headerTintColor: '#fff',
//               headerTitleStyle: { fontWeight: 'bold' },
//               headerShadowVisible: false,
//               headerRight: () => 
//                 (navigation.getState().routes[navigation.getState().index].name !== 'Login' &&
//                 navigation.getState().routes[navigation.getState().index].name !== 'Signup') ? (
//                   <HeaderIcons navigation={navigation} handleSignOut={() => handleSignOut(navigation)} />
//                 ) : null,
//               headerTitle: ''
//             })}
//           >
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//             <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
//             <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
//             <Stack.Screen name="UserSettingsScreen" component={UserSettingsScreen} />
//             <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
//             <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
//        <Stack.Screen name="UpdateEmail" component={UpdateEmailScreen} />
//       <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
//       <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen}  />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </MenuProvider>
//     </NotificationProvider>
//   );
// }


// App.js
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import CategoryListScreen from './src/screens/CategoryListScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import HomeScreen from './src/screens/HomeScreen';
import ManageTeamScreen from './src/screens/ManageTeamScreen';
import { MenuProvider } from 'react-native-popup-menu';
import SignupScreen from './src/screens/SignupScreen';
import UserSettingsScreen from './src/screens/UserSettingsScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';
import { name as appName } from './app.json';
import { NotificationProvider } from './src/components/NotificationProvider';
import NotificationTestScreen from './src/screens/NotificationTestScreen';
import HeaderIcons from './src/components/HeaderIcons'; // Import the HeaderIcons component
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth
import UpdateEmailScreen from './src/screens/UpdateEmailScreen'; // Correct import for default export
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'; // Correct import for default export
import DeleteAccountScreen from './src/screens/DeleteAccountScreen'; // Correct import for default export
import NetworkCheck from './src/components/NetworkCheck'; // Import the NetworkCheck component
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import { StatusBar } from 'expo-status-bar'; // Import StatusBar

const Stack = createStackNavigator();
const auth = getAuth();

AppRegistry.registerComponent(appName, () => App);

export default function App() {
  const handleSignOut = async (navigation) => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <NotificationProvider>
      <MenuProvider>
        <NetworkCheck>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Set the StatusBar background color and style */}
            <StatusBar backgroundColor="#9cacbc" style="dark" />
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={({ navigation }) => ({
                  headerStyle: { backgroundColor: '#9cacbc' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                  headerShadowVisible: false,
                  headerTitleAlign: 'center', // Center the title
                  headerRight: () =>
                    (navigation.getState().routes[navigation.getState().index].name !== 'Login' &&
                    navigation.getState().routes[navigation.getState().index].name !== 'Signup') ? (
                      <HeaderIcons navigation={navigation} handleSignOut={() => handleSignOut(navigation)} />
                    ) : null,
                  headerTitle: 'SAMIs App',
                })}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen}
                options={{
                  headerTitle: '' // Set the header title to "MY TEAMS" for the Home screen

}} />
                <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen}options={{
                                      headerTitle: 'SHELF ITEMS' // Set the header title to "MY TEAMS" for the Home screen

                 }} />
                <Stack.Screen name="CategoryListScreen" component={CategoryListScreen}  options={{
                                      headerTitle: 'TEAM SHELVES' // Set the header title to "MY TEAMS" for the Home screen

                 }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft: null,
                                      headerTitle: 'MY TEAMS' // Set the header title to "MY TEAMS" for the Home screen

                 }} />
                <Stack.Screen name="ManageTeam" component={ManageTeamScreen} />
                <Stack.Screen name="UserSettingsScreen">
                  {props => <UserSettingsScreen {...props} handleSignOut={() => handleSignOut(props.navigation)} />}
                </Stack.Screen>
                <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{
                  headerRight: null ,headerTitle: '', // Remove the notifications icon for ChangePassword screen
                }} />
                <Stack.Screen name="NotificationTest" component={NotificationTestScreen} options={{
                  headerRight: null ,headerTitle: 'NOTIFICATIONS', // Remove the notifications icon for ChangePassword screen
                }} />
                <Stack.Screen name="UpdateEmail" component={UpdateEmailScreen} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}
                options={{
                  headerRight: null ,headerTitle: '', // Remove the notifications icon for ChangePassword screen
                }} />
                <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </NetworkCheck>
      </MenuProvider>
    </NotificationProvider>
  );
}
