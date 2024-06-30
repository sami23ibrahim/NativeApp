import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationBadge from './NotificationBadge'; // Ensure this import path is correct

const HeaderIcons = ({ navigation, handleSignOut }) => {
  return (
    <View style={styles.container}>
      
{/* 


      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="home" size={30} color="white" />
      </View>
    </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate('UserSettingsScreen')}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="account" size={30} color="white" />
      </View>
    </TouchableOpacity>
     */}
      <View style={styles.iconContainer}>
        <NotificationBadge onPress={() => navigation.navigate('NotificationTest')} />
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
    backgroundColor: 'rgba(172, 188, 198, 0.33)',
    borderRadius: 90, // Adjust this to make the background more or less rounded
    padding: 10, // Adjust the padding to control the size of the background
    justifyContent: 'center',
    alignItems: 'center',marginHorizontal:30, // Adjust this for equal spacing between icons
  },

});

export default HeaderIcons;
