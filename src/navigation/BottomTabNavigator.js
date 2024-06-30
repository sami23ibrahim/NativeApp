// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationTestScreen from '../screens/NotificationTestScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-none';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Notifications" component={NotificationTestScreen} />
      <Tab.Screen name="Settings" component={UserSettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
