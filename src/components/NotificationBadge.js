import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NotificationContext } from './NotificationProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationBadge = ({ onPress }) => {
  const { unreadNotifications } = useContext(NotificationContext);

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={30}
          color={unreadNotifications ? 'red' : 'rgba(150, 150, 150, 0.83)'} // Change bell color
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: 'black',
    borderRadius: 90,
    padding: 4.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30, // Add space to the right side of the icon
  },
});

export default NotificationBadge;
