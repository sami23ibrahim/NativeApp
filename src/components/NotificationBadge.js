// src/components/NotificationBadge.js
import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NotificationContext } from './NotificationProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationBadge = ({ onPress }) => {
  const { unreadNotifications } = useContext(NotificationContext);
  console.log('NotificationBadge - unreadNotifications:', unreadNotifications); // Debugging log

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={30}
          color={unreadNotifications ? 'red' : 'white'} // Change bell color
        />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationBadge;
