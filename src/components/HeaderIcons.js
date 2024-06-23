import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationBadge from './NotificationBadge'; // Ensure this import path is correct

const HeaderIcons = ({ navigation, handleSignOut }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <NotificationBadge onPress={() => navigation.navigate('NotificationTest')} />
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserSettingsScreen')}>
          <MaterialCommunityIcons name="cog" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5, // Adjust this if needed for spacing from the right edge
  },
  iconContainer: {
    marginHorizontal:30, // Adjust this for equal spacing between icons
  },
});

export default HeaderIcons;
