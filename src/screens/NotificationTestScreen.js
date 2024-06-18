
// // src/screens/NotificationTestScreen.js
// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
// import { NotificationContext } from '../components/NotificationProvider';
// import { useNavigation } from '@react-navigation/native';

// const NotificationTestScreen = () => {
//   const { notifications, clearNotifications } = useContext(NotificationContext);
//   const navigation = useNavigation();

//   console.log('NotificationTestScreen - notifications:', notifications); // Debugging log

//   const handleNotificationPress = (notification) => {
//     console.log('Notification pressed:', notification); // Debugging log
//     navigation.navigate('ManageTeam', { teamId: notification.teamId });
//   };

//   const renderItem = ({ item }) => {
//     console.log('Rendering item:', item); // Debugging log

//     // Convert timestamp to date string
//     const timestampString = new Date(item.timestamp.seconds * 1000).toLocaleString();

//     return (
//       <TouchableOpacity onPress={() => handleNotificationPress(item)}>
//         <View style={styles.notificationContainer}>
//           <Text style={styles.notificationText}>
//             {`${item.userName} wants to join ${item.teamName}`}
//           </Text>
//           <Text style={styles.notificationTimestamp}>{timestampString}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Notification Test Screen</Text>
//       <FlatList
//         data={notifications.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)} // Sort notifications by timestamp
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//       />
//       <Button title="Clear Notifications" onPress={clearNotifications} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationContainer: {
//     margin: 10,
//     padding: 10,
//     backgroundColor: '#eee',
//     borderRadius: 5,
//   },
//   notificationText: {
//     marginBottom: 5,
//   },
//   notificationTimestamp: {
//     color: '#888',
//   },
// });

// export default NotificationTestScreen;

// src/screens/NotificationTestScreen.js
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { NotificationContext } from '../components/NotificationProvider';
import { useNavigation } from '@react-navigation/native';

const NotificationTestScreen = () => {
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const navigation = useNavigation();

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  console.log('NotificationTestScreen - notifications:', notifications);

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification);
    navigation.navigate('ManageTeam', { teamId: notification.teamId });
  };

  const renderItem = ({ item }) => {
    console.log('Rendering item:', item);

    // Convert timestamp to date string
    const timestampString = new Date(item.timestamp.seconds * 1000).toLocaleString();

    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>
            {`${item.userName} wants to join ${item.teamName}`}
          </Text>
          <Text style={styles.notificationTimestamp}>{timestampString}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Notification Test Screen</Text>
      <FlatList
        data={notifications.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)} // Sort notifications by timestamp
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  notificationText: {
    marginBottom: 5,
  },
  notificationTimestamp: {
    color: '#888',
  },
});

export default NotificationTestScreen;
