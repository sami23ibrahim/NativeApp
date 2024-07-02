
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
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NotificationContext } from '../components/NotificationProvider';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firebase Firestore

const NotificationTestScreen = () => {
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const navigation = useNavigation();
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  const handleNotificationPress = async (notification) => {
    const teamDocRef = doc(db, 'teams', notification.teamId);
    const teamDocSnap = await getDoc(teamDocRef);

    if (teamDocSnap.exists()) {
      navigation.navigate('ManageTeam', { teamId: notification.teamId });
    } else {
      Alert.alert('Team not found', 'The team has been deleted or does not exist.');
    }
  };

  const renderItem = ({ item }) => {
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
      <FlatList
        data={notifications.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',backgroundColor: 'rgba(172, 188, 198, 0.7)',
    alignItems: 'center',
  },
  notificationContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  notificationText: {
    marginBottom: 5,
  },
  notificationTimestamp: {
    color: '#888',
  },
});

export default NotificationTestScreen;
