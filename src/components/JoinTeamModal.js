

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';

// const JoinTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamId, setTeamId] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const handleJoinTeam = async () => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       await updateDoc(teamRef, {
//         members: arrayUnion(user.uid),
//       });
//       Alert.alert('Joined team successfully!');
//       setVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error joining team: ', error);
//       Alert.alert('Error', 'Failed to join team.');
//     }
//   };

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Join Existing Team</Text>
//       <TextInput
//         placeholder="Team ID"
//         value={teamId}
//         onChangeText={setTeamId}
//         style={styles.input}
//       />
//       <Button title="Join Team" onPress={handleJoinTeam} />
//       <Button title="Cancel" onPress={() => setVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//   },
// });

// export default JoinTeamModal;

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';

// const JoinTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamId, setTeamId] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const handleJoinTeam = async () => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamSnapshot = await getDoc(teamRef);

//       if (teamSnapshot.exists()) {
//         const teamData = teamSnapshot.data();

//         // Check if the user is already in the team
//         const isMember = teamData.members.some(member => member.uid === user.uid);
//         if (isMember) {
//           Alert.alert('Error', 'You are already a member of this team.');
//           return;
//         }

//         // Fetch user details to get the imageUrl
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         const userImageUrl = userDoc.data().imageUrl;

//         // Add user to the team's members array
//         await updateDoc(teamRef, {
//           members: arrayUnion({ uid: user.uid, name: user.displayName, imageUrl: userImageUrl, admin: false })
//         });

//         // Add team to the user's teams array
//         await updateDoc(userDocRef, {
//             teams: arrayUnion({
//             name: teamData.name,
//          // role: 'member', // or another appropriate role
//             teamId: teamId,
//             uid: user.uid,
//           })
//         });

//         Alert.alert('Joined team successfully!');
//         setVisible(false);
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//     } catch (error) {
//       console.error('Error joining team: ', error);
//       Alert.alert('Error', 'Failed to join team.');
//     }
//   };

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Join Existing Team</Text>
//       <TextInput
//         placeholder="Team ID"
//         value={teamId}
//         onChangeText={setTeamId}
//         style={styles.input}
//       />
//       <Button title="Join Team" onPress={handleJoinTeam} />
//       <Button title="Cancel" onPress={() => setVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//   },
// });

// export default JoinTeamModal;

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';

// const JoinTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamId, setTeamId] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const handleJoinTeam = async () => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamSnapshot = await getDoc(teamRef);

//       if (teamSnapshot.exists()) {
//         const teamData = teamSnapshot.data();

//         // Check if the user is already in the team
//         const isMember = teamData.members.some(member => member.uid === user.uid);
//         if (isMember) {
//           Alert.alert('Error', 'You are already a member of this team.');
//           return;
//         }

//         // Add user to the team's members array
//         await updateDoc(teamRef, {
//           members: arrayUnion({ uid: user.uid, name: user.displayName, imageUrl: user.photoURL, admin: false })
//         });

//         // Add teamId to the user's teams array with the necessary fields
//         const userDocRef = doc(firestore, 'users', user.uid);
//         await updateDoc(userDocRef, {
//           teams: arrayUnion({
//             teamId: teamId,
//             uid: teamData.owner.uid, // Use the owner's uid
//           })
//         });

//         Alert.alert('Joined team successfully!');
//         setVisible(false);
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//     } catch (error) {
//       console.error('Error joining team: ', error);
//       Alert.alert('Error', 'Failed to join team.');
//     }
//   };

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Join Existing Team</Text>
//       <TextInput
//         placeholder="Enter Team ID"
//         value={teamId}
//           placeholderTextColor='white'
//         onChangeText={setTeamId}
//         style={styles.input}
//       />
//       <View style={styles.buttons}>
//       <Button title="Send Request" 
//       padding={23} 
//       color={'#9cacbc'} 
//       onPress={handleJoinTeam} />
//       <Button title="Cancel"  
//       color={'#9cacbc'} 
//       onPress={() => setVisible(false)} />
//         </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttons:{
//     flexDirection: 'row',padding:20,borderRadius: 40,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,color:'white'
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12, borderRadius: 20,
//     paddingHorizontal: 8,color:'white',
//     width: 200,
//   },
// });

// export default JoinTeamModal;
// JoinTeamModal.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';
import { NotificationContext } from './NotificationProvider'; // Correctly import NotificationContext
import { addNotification as addNotificationUtil } from './notificationUtils'; // Import addNotification function correctly

const JoinTeamModal = ({ setVisible, refreshTeams }) => {
  const [teamId, setTeamId] = useState('');
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const { addNotification } = useContext(NotificationContext); // Use NotificationContext

  const handleJoinTeam = async () => {
    try {
      if (!teamId) {
        Alert.alert('Error', 'Please enter a valid team ID.');
        return;
      }

      const teamRef = doc(firestore, 'teams', teamId);
      const teamSnapshot = await getDoc(teamRef);

      if (teamSnapshot.exists()) {
        const teamData = teamSnapshot.data();

        const isMember = teamData.members.some(member => member.uid === user.uid);
        if (isMember) {
          Alert.alert('Error', 'You are already a member of this team.');
          return;
        }

        const joinRequestRef = doc(firestore, 'joinRequests', `${teamId}_${user.uid}`);
        const joinRequestSnapshot = await getDoc(joinRequestRef);
        if (joinRequestSnapshot.exists()) {
          Alert.alert('Error', 'You already have a pending join request for this team.');
          return;
        }

        await setDoc(joinRequestRef, {
          teamId: teamId,
          userId: user.uid,
          userName: user.displayName,
          userImageUrl: user.photoURL,
          status: 'pending'
        });

        // Use the addNotification function from notificationUtils
        await addNotificationUtil(teamData.owner.uid, { userName: user.displayName, teamName: teamData.name, teamId: teamId, ownerId: teamData.owner.uid });

        Alert.alert('Request sent!', 'Your request to join the team has been sent.');
        setVisible(false);
        refreshTeams();
      } else {
        Alert.alert('Error', 'Team not found.');
      }
    } catch (error) {
      console.error('Error sending join request: ', error);
      Alert.alert('Error', 'Failed to send join request.');
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Join Existing Team</Text>
      <TextInput
        placeholder="Enter Team ID"
        value={teamId}
        placeholderTextColor='white'
        onChangeText={setTeamId}
        style={styles.input}
      />
      {/* <View style={styles.buttons}>
        <Button title="Send Request" padding={23} color={'#9cacbc'} onPress={handleJoinTeam} />
        <Button title="Cancel" color={'#9cacbc'} onPress={() => setVisible(false)} />
      </View> */}
      <View style={styles.buttonRow}>
  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleJoinTeam}>
    <Text style={styles.buttonText}>Send Request</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setVisible(false)}>
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>
</View>






    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
    padding: 10,
    borderRadius: 5,  justifyContent: 'space-between',
    marginVertical: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  cancelButton: {
    width:'55%',
    elevation: 5,
    paddingVertical: 10,marginHorizontal: 5, // Add margin between the buttons
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this as needed
    marginTop: 20, // Add some margin to separate from other elements
   
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 8,
    color: 'white',
    width: 200,
  },
});

export default JoinTeamModal;
