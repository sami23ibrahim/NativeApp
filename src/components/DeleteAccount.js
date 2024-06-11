// // src/components/DeleteAccount.js

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { db } from '../config/firebase'; // Ensure this import matches your Firebase config

// const DeleteAccount = ({ navigation }) => {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const auth = getAuth();

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       await handleAccountDeletion();
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Reauthentication Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleAccountDeletion = async () => {
//     try {
//       const user = auth.currentUser;
//       console.log('Firestore Instance:', db);
//       console.log('User UID:', user.uid);

//       const userDocRef = doc(db, 'users', user.uid);
//       console.log('User Document Reference:', userDocRef);

//       // Delete user from Firestore
//       await deleteDoc(userDocRef);
//       console.log('User document deleted successfully from Firestore');

//       // Delete user from Firebase Authentication
//       await deleteUser(user);
//       console.log('Account deleted successfully from Firebase Authentication');
      
//       navigation.navigate('Login');
//       Alert.alert('Success', 'Account deleted successfully.');
//     } catch (error) {
//       console.error('Account Deletion Error:', error);
//       Alert.alert('Error', error.message);
//       if (error.code === 'auth/requires-recent-login') {
//         setModalVisible(true);
//       }
//     }
//   };

//   return (
//     <View>
//       <Text style={styles.title}>Delete Account</Text>
//       <Button title="Delete Account" onPress={() => setModalVisible(true)} color="red" />
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <Text style={styles.modalText}>Please reauthenticate to proceed</Text>
//           <TextInput
//             placeholder="Current Password"
//             value={currentPassword}
//             onChangeText={setCurrentPassword}
//             secureTextEntry
//             style={styles.input}
//           />
//           <Button title="Reauthenticate" onPress={handleReauthenticate} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//     borderRadius: 5,
//   },
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
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default DeleteAccount;




// src/components/DeleteAccount.js

// src/components/DeleteAccount.js

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
// import { doc, deleteDoc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { db } from '../config/firebase'; // Ensure this import matches your Firebase config

// const DeleteAccount = ({ navigation }) => {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const auth = getAuth();

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       await handleAccountDeletion();
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Reauthentication Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleAccountDeletion = async () => {
//     try {
//       const user = auth.currentUser;
//       const userDocRef = doc(db, 'users', user.uid);
      
//       // Fetch the user document
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teams = userData.teams || [];

//         // Loop through each team and remove the user from the members array
//         for (const team of teams) {
//           const teamDocRef = doc(db, 'teams', team.teamId);
//           const teamDoc = await getDoc(teamDocRef);
//           if (teamDoc.exists()) {
//             const teamData = teamDoc.data();
//             const member = teamData.members.find(m => m.uid === user.uid);
//             if (member) {
//               await updateDoc(teamDocRef, {
//                 members: arrayRemove(member)
//               });
//             }
//           }
//         }

//         // Delete user from Firestore
//         await deleteDoc(userDocRef);
//         console.log('User document deleted successfully from Firestore');

//         // Delete user from Firebase Authentication
//         await deleteUser(user);
//         console.log('Account deleted successfully from Firebase Authentication');
        
//         navigation.navigate('Login');
//         Alert.alert('Success', 'Account deleted successfully.');
//       } else {
//         throw new Error('User document does not exist.');
//       }
//     } catch (error) {
//       console.error('Account Deletion Error:', error);
//       Alert.alert('Error', error.message);
//       if (error.code === 'auth/requires-recent-login') {
//         setModalVisible(true);
//       }
//     }
//   };

//   return (
//     <View>
//       <Text style={styles.title}>Delete Account</Text>
//       <Button title="Delete Account" onPress={() => setModalVisible(true)} color="red" />
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <Text style={styles.modalText}>Please reauthenticate to proceed</Text>
//           <TextInput
//             placeholder="Current Password"
//             value={currentPassword}
//             onChangeText={setCurrentPassword}
//             secureTextEntry
//             style={styles.input}
//           />
//           <Button title="Reauthenticate" onPress={handleReauthenticate} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//     borderRadius: 5,
//   },
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
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default DeleteAccount;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, deleteDoc, getDoc, updateDoc, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../config/firebase'; // Ensure this import matches your Firebase config

const DeleteAccount = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();

  const handleReauthenticate = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await handleAccountDeletion();
      setModalVisible(false);
    } catch (error) {
      console.error('Reauthentication Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();

        // Delete associated categories and items
        const categoriesQuerySnapshot = await getDocs(collection(db, 'categories'));
        for (const categoryDoc of categoriesQuerySnapshot.docs) {
          const categoryData = categoryDoc.data();
          if (categoryData.teamId === teamId) {
            const itemsQuerySnapshot = await getDocs(collection(db, 'categories', categoryDoc.id, 'items'));
            for (const itemDoc of itemsQuerySnapshot.docs) {
              // Delete item document and associated image
              await deleteDoc(doc(db, 'categories', categoryDoc.id, 'items', itemDoc.id));
              const itemData = itemDoc.data();
              if (itemData.img) {
                const imgRef = ref(storage, itemData.img);
                await deleteObject(imgRef);
              }
            }
            // Delete category document and associated image
            if (categoryData.img) {
              const categoryImgRef = ref(storage, categoryData.img);
              await deleteObject(categoryImgRef);
            }
            await deleteDoc(doc(db, 'categories', categoryDoc.id));
          }
        }

        // Delete team image
        if (teamData.imageUrl) {
          const teamImgRef = ref(storage, teamData.imageUrl);
          await deleteObject(teamImgRef);
        }

        // Delete the team document
        await deleteDoc(teamRef);
      }
    } catch (error) {
      console.error('Error deleting team: ', error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);

      // Fetch the user document
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const teams = userData.teams || [];

        // Loop through each team and check if the user is the owner
        for (const team of teams) {
          const teamDocRef = doc(db, 'teams', team.teamId);
          const teamDoc = await getDoc(teamDocRef);
          if (teamDoc.exists()) {
            const teamData = teamDoc.data();
            if (teamData.owner.uid === user.uid) {
              // If the user is the owner, delete the team
              await deleteTeam(team.teamId);
            } else {
              // Remove the user from the team members array
              const member = teamData.members.find(m => m.uid === user.uid);
              if (member) {
                await updateDoc(teamDocRef, {
                  members: arrayRemove(member)
                });
              }
            }
          }
        }

        // Delete the user's image from Firebase Storage
        if (userData.imageUrl) {
          const userImgRef = ref(storage, userData.imageUrl);
          await deleteObject(userImgRef);
        }

        // Delete user from Firestore
        await deleteDoc(userDocRef);

        // Delete user from Firebase Authentication
        await deleteUser(user);

        navigation.navigate('Login');
        Alert.alert('Success', 'Account deleted successfully.');
      } else {
        throw new Error('User document does not exist.');
      }
    } catch (error) {
      console.error('Account Deletion Error:', error);
      Alert.alert('Error', error.message);
      if (error.code === 'auth/requires-recent-login') {
        setModalVisible(true);
      }
    }
  };

  return (
    <View>
      <Text style={styles.title}>Delete Account</Text>
      <Button title="Delete Account" onPress={() => setModalVisible(true)} color="red" />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Please reauthenticate to proceed</Text>
          <TextInput
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Reauthenticate" onPress={handleReauthenticate} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default DeleteAccount;
