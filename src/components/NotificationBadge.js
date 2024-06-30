import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NotificationContext } from './NotificationProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationBadge = ({ onPress }) => {
  const { unreadNotifications } = useContext(NotificationContext);

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={30}
          color={unreadNotifications ? '#b2d3c2' : 'white'} // Change bell color
        />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationBadge;
