
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

import React, { useContext, useEffect, useCallback,useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Dimensions } from 'react-native';
import { NotificationContext } from '../components/NotificationProvider';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const NotificationTestScreen = () => {
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const navigation = useNavigation();
  const db = getFirestore();
  const { width } = Dimensions.get('window');

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  const handleNotificationPress = useCallback(async (notification) => {
    try {
      const teamDocRef = doc(db, 'teams', notification.teamId);
      const teamDocSnap = await getDoc(teamDocRef);

      if (teamDocSnap.exists()) {
        navigation.navigate('ManageTeam', { teamId: notification.teamId });
      } else {
        Alert.alert('Team not found', 'The team has been deleted or does not exist.');
      }
    } catch (error) {
      console.error('Error fetching team document:', error);
      Alert.alert('Error', 'Failed to fetch team details.');
    }
  }, [db, navigation]);

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

  const sortedNotifications = useMemo(() => 
    notifications.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds), 
    [notifications]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(172, 188, 198, 0.7)', backgroundColor: 'black',
    alignItems: 'center',
    padding: 10,
  },
  notificationContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: 'gray',backgroundColor: 'rgba(172, 188, 198, 0.19)',
    borderRadius: 5,
    width: width * 0.9,
  },
  notificationText: {
    marginBottom: 5,
    fontSize: 16,
    color: 'white',
  },
  notificationTimestamp: {
    color: 'white',
    fontSize: 14,
  },
});

export default React.memo(NotificationTestScreen);
