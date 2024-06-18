import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

// Create Notification Context
export const NotificationContext = createContext();

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = FIREBASE_AUTH.currentUser;

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  useEffect(() => {
    const userNotifications = notifications.filter(notification => notification.ownerId === user?.uid);
    setUnreadCount(userNotifications.length);
  }, [notifications, user]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Test Screen Component
const NotificationTestScreen = () => {
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const navigation = useNavigation();

  const handleNotificationPress = (notification) => {
    navigation.navigate('ManageTeam', { teamId: notification.teamId });
    clearNotifications();
  };

  return (
    <View style={styles.container}>
      <Text>Notification Test Screen</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationPress(item)}>
            <Text style={styles.notification}>{`${item.userName} wants to join ${item.teamName}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    margin: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
});

export default NotificationTestScreen;
