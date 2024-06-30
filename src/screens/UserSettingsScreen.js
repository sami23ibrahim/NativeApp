// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';

// const UserSettingsScreen = ({ navigation }) => {
//   const [newEmail, setNewEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [action, setAction] = useState('');
//   const auth = getAuth();

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       console.log('Reauthentication successful');
//       if (action === 'email') {
//         await updateEmailAfterReauthentication();
//       } else if (action === 'password') {
//         handlePasswordChange();
//       } else if (action === 'delete') {
//         handleAccountDeletion();
//       }
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Reauthentication Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleEmailChange = () => {
//     const user = auth.currentUser;
//     if (newEmail.trim() === '') {
//       Alert.alert('Error', 'Please enter a valid email.');
//       return;
//     }
//     if (newEmail === user.email) {
//       Alert.alert('Error', 'This email is already in use for this account.');
//       return;
//     }
//     setAction('email');
//     setModalVisible(true);
//   };

//   const updateEmailAfterReauthentication = async () => {
//     try {
//       const user = auth.currentUser;
//       await updateEmail(user, newEmail);
//       console.log('Email updated successfully');
//       await signOut(auth);
//       navigation.navigate('Login'); // Adjust this line to navigate to your sign-in screen
//       Alert.alert('Success', 'Email updated successfully. Please sign in with your new email.');
//     } catch (error) {
//       console.error('Email Update Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (newPassword.trim() === '') {
//       Alert.alert('Error', 'Please enter a valid password.');
//       return;
//     }
//     try {
//       const user = auth.currentUser;
//       await updatePassword(user, newPassword);
//       console.log('Password updated successfully');
//       Alert.alert('Success', 'Password updated successfully.');
//     } catch (error) {
//       console.error('Password Change Error:', error);
//       Alert.alert('Error', error.message);
//       if (error.code === 'auth/requires-recent-login') {
//         setAction('password');
//         setModalVisible(true);
//       }
//     }
//   };

//   const handleAccountDeletion = async () => {
//     try {
//       const user = auth.currentUser;
//       await deleteUser(user);
//       console.log('Account deleted successfully');
//       Alert.alert('Success', 'Account deleted successfully.');
//     } catch (error) {
//       console.error('Account Deletion Error:', error);
//       Alert.alert('Error', error.message);
//       if (error.code === 'auth/requires-recent-login') {
//         setAction('delete');
//         setModalVisible(true);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>User Settings</Text>
//       <TextInput
//         placeholder="New Email"
//         value={newEmail}
//         onChangeText={setNewEmail}
//         style={styles.input}
//       />
//       <Button title="Update Email" onPress={handleEmailChange} />
//       <TextInput
//         placeholder="New Password"
//         value={newPassword}
//         onChangeText={setNewPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       <Button title="Update Password" onPress={handlePasswordChange} />
//       <Button title="Delete Account" onPress={handleAccountDeletion} color="red" />

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
//   container: {
//     flex: 1,
//     padding: 20,
//   },
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
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default UserSettingsScreen;





// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
// import { FIREBASE_AUTH, db } from '../config/firebase'; // Import the db instance
// import { doc, updateDoc } from 'firebase/firestore';

// const UserSettingsScreen = ({ navigation }) => {
//   const [newEmail, setNewEmail] = useState('');
//   const [confirmNewEmail, setConfirmNewEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [action, setAction] = useState('');
//   const [emailMismatch, setEmailMismatch] = useState(false);
//   const [emailSameAsCurrent, setEmailSameAsCurrent] = useState(false);
//   const [passwordMismatch, setPasswordMismatch] = useState(false);
//   const auth = getAuth();

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       console.log('Reauthentication successful');
//       if (action === 'email') {
//         await updateEmailAfterReauthentication();
//       } else if (action === 'password') {
//         await updatePasswordAfterReauthentication();
//       } else if (action === 'delete') {
//         handleAccountDeletion();
//       }
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Reauthentication Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleEmailChange = () => {
//     const user = auth.currentUser;
//     if (newEmail.trim() === '' || confirmNewEmail.trim() === '') {
//       Alert.alert('Error', 'Please enter a valid email.');
//       return;
//     }
//     if (newEmail !== confirmNewEmail) {
//       setEmailMismatch(true);
//       Alert.alert('Error', 'The email addresses do not match.');
//       return;
//     }
//     if (newEmail === user.email) {
//       setEmailSameAsCurrent(true);
//       Alert.alert('Error', 'This email is already in use for this account.');
//       return;
//     }
//     setEmailMismatch(false);
//     setEmailSameAsCurrent(false);
//     setAction('email');
//     setModalVisible(true);
//   };

//   const updateEmailAfterReauthentication = async () => {
//     try {
//       const user = auth.currentUser;
//       await updateEmail(user, newEmail);
//       console.log('Email updated successfully in Authentication');
      
//       // Update the email in Firestore
//       const userDocRef = doc(db, 'users', user.uid);
//       await updateDoc(userDocRef, {
//         email: newEmail,
//       });
//       console.log('Email updated successfully in Firestore');
      
//       await signOut(auth);
//       navigation.navigate('Login'); // Adjust this line to navigate to your sign-in screen
//       Alert.alert('Success', 'Email updated successfully. Please sign in with your new email.');
//     } catch (error) {
//       console.error('Email Update Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handlePasswordChange = () => {
//     if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
//       Alert.alert('Error', 'Please enter a valid password.');
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setPasswordMismatch(true);
//       Alert.alert('Error', 'The passwords do not match.');
//       return;
//     }
//     setPasswordMismatch(false);
//     setAction('password');
//     setModalVisible(true);
//   };

//   const updatePasswordAfterReauthentication = async () => {
//     try {
//       const user = auth.currentUser;
//       await updatePassword(user, newPassword);
//       console.log('Password updated successfully');
//       Alert.alert('Success', 'Password updated successfully.');
//     } catch (error) {
//       console.error('Password Change Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleAccountDeletion = async () => {
//     try {
//       const user = auth.currentUser;
//       await deleteUser(user);
//       console.log('Account deleted successfully');
//       Alert.alert('Success', 'Account deleted successfully.');
//     } catch (error) {
//       console.error('Account Deletion Error:', error);
//       Alert.alert('Error', error.message);
//       if (error.code === 'auth/requires-recent-login') {
//         setAction('delete');
//         setModalVisible(true);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Email</Text>
//       <TextInput
//         placeholder="New Email"
//         value={newEmail}
//         onChangeText={setNewEmail}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Confirm New Email"
//         value={confirmNewEmail}
//         onChangeText={setConfirmNewEmail}
//         style={[styles.input, (emailMismatch || emailSameAsCurrent) && { borderColor: 'red' }]}
//       />
//       <Button title="Update Email" onPress={handleEmailChange} />
//       {emailMismatch && <Text style={styles.errorText}>The email addresses do not match.</Text>}
//       {emailSameAsCurrent && <Text style={styles.errorText}>This email is already in use for this account.</Text>}
//       <Text style={styles.warningText}>
//         Make sure to enter a correct email address because after confirmation you will lose access from the previous email and will have access only from the newly entered email.
//       </Text>
//       <Text style={styles.title}>Update Password</Text>

//       <TextInput
//         placeholder="New Password"
//         value={newPassword}
//         onChangeText={setNewPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Confirm New Password"
//         value={confirmNewPassword}
//         onChangeText={setConfirmNewPassword}
//         secureTextEntry
//         style={[styles.input, passwordMismatch && { borderColor: 'red' }]}
//       />
//       <Button title="Update Password" onPress={handlePasswordChange} />
//       {passwordMismatch && <Text style={styles.errorText}>The passwords do not match.</Text>}
//       <Text style={styles.title}>Delete Account</Text>

//       <Button title="Delete Account" onPress={handleAccountDeletion} color="red" />

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
//   container: {
//     flex: 1,
//     padding: 20,
//   },
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
//   warningText: {
//     color: 'red',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 20,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default UserSettingsScreen;



// src/screens/UserSettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons if you haven't

const UserSettingsScreen = ({ handleSignOut }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('UpdateEmail')}>
        <Text style={styles.optionText}>Update Email</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('DeleteAccount')}>
        <Text style={styles.optionText}>Delete Account</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={handleSignOut}>
        <Text style={styles.optionText}>Sign Out</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9cacbc',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
    color: 'white',
  },
});

export default UserSettingsScreen;
