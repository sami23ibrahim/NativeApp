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



import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';

const JoinTeamModal = ({ setVisible, refreshTeams }) => {
  const [teamId, setTeamId] = useState('');
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const handleJoinTeam = async () => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(user.uid),
      });
      Alert.alert('Joined team successfully!');
      setVisible(false);
      refreshTeams();
    } catch (error) {
      console.error('Error joining team: ', error);
      Alert.alert('Error', 'Failed to join team.');
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Join Existing Team</Text>
      <TextInput
        placeholder="Team ID"
        value={teamId}
        onChangeText={setTeamId}
        style={styles.input}
      />
      <Button title="Join Team" onPress={handleJoinTeam} />
      <Button title="Cancel" onPress={() => setVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 200,
  },
});

export default JoinTeamModal;
