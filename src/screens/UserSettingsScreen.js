

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, onAuthStateChanged, signOut } from 'firebase/auth';

// const UserSettingsScreen = ({ navigation }) => {
//   const [newEmail, setNewEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [action, setAction] = useState('');
//   const [verificationSent, setVerificationSent] = useState(false);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user && user.emailVerified && verificationSent) {
//         updateEmailAfterVerification();
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, verificationSent]);

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       console.log('Reauthentication successful');
//       if (action === 'email') {
//         sendVerificationToNewEmail();
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

//   const sendVerificationToNewEmail = async () => {
//     try {
//       const user = auth.currentUser;
//       const actionCodeSettings = {
//         url: 'https://fir-test-ddf72.firebaseapp.com', // Ensure this is an authorized domain
//         handleCodeInApp: true,
//       };
//       await sendEmailVerification(user, actionCodeSettings);
//       console.log('Verification email sent to:', user.email);
//       setVerificationSent(true);
//       Alert.alert('Verification Email Sent', 'Please verify your new email address by clicking the link sent to it.');
//     } catch (error) {
//       console.error('Send Verification Email Error:', error);
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

//   const updateEmailAfterVerification = async () => {
//     try {
//       const user = auth.currentUser;
//       console.log('Updating email to:', newEmail);
//       await updateEmail(user, newEmail);
//       console.log('Email updated successfully');
//       setVerificationSent(false);
//       await signOut(auth);
//       navigation.navigate('Login'); // Adjust this line to navigate to your sign-in screen
//       Alert.alert('Success', 'Email updated successfully. Please sign in with your new email.');
//     } catch (error) {
//       console.error('Email Update Error:', error);
//       Alert.alert('Error', error.message);
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

//       {verificationSent && (
//         <View style={styles.verificationContainer}>
//           <Text style={styles.verificationText}>A verification email has been sent to {newEmail}. Please verify your new email address by clicking the link sent to it.</Text>
//           <Button title="I have verified my email" onPress={updateEmailAfterVerification} />
//         </View>
//       )}
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
//   verificationContainer: {
//     padding: 20,
//     backgroundColor: '#e7f4ff',
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   verificationText: {
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });

// export default UserSettingsScreen;






// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
// import { getAuth, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, onAuthStateChanged, signOut } from 'firebase/auth';

// const UserSettingsScreen = ({ navigation }) => {
//   const [newEmail, setNewEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [action, setAction] = useState('');
//   const [verificationSent, setVerificationSent] = useState(false);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user && user.emailVerified && verificationSent) {
//         updateEmailAfterVerification();
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, verificationSent]);

//   const handleReauthenticate = async () => {
//     try {
//       const user = auth.currentUser;
//       const credential = EmailAuthProvider.credential(user.email, currentPassword);
//       await reauthenticateWithCredential(user, credential);
//       console.log('Reauthentication successful');
//       if (action === 'email') {
//         await notifyCurrentEmail(user.email, newEmail);
//         await sendVerificationToNewEmail();
//         await signOut(auth);
//         navigation.navigate('Login');
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

//   const sendVerificationToNewEmail = async () => {
//     try {
//       const user = auth.currentUser;
//       const actionCodeSettings = {
//         url: 'https://fir-test-ddf72.firebaseapp.com', // Ensure this is an authorized domain
//         handleCodeInApp: true,
//       };
//       await sendEmailVerification(user, actionCodeSettings);
//       console.log('Verification email sent to:', newEmail);
//       setVerificationSent(true);
//       Alert.alert('Verification Email Sent', 'Please verify your new email address by clicking the link sent to it.');
//     } catch (error) {
//       console.error('Send Verification Email Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const notifyCurrentEmail = async (currentEmail, newEmail) => {
//     // Here you would integrate with an email service to notify the current email
//     // This is a placeholder for sending the notification email
//     console.log(`Notify current email: ${currentEmail} about email change to: ${newEmail}`);
//     // Use your backend service to send an email with the link to recover the email
//   };

//   const handleEmailChange = () => {
//     if (newEmail.trim() === '') {
//       Alert.alert('Error', 'Please enter a valid email.');
//       return;
//     }
//     const user = auth.currentUser;
//     if (user.email === newEmail.trim()) {
//       Alert.alert('Error', 'The new email is the same as the current email.');
//       return;
//     }
//     setAction('email');
//     setModalVisible(true);
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

//   const updateEmailAfterVerification = async () => {
//     try {
//       const user = auth.currentUser;
//       console.log('Updating email to:', newEmail);
//       await updateEmail(user, newEmail);
//       console.log('Email updated successfully');
//       setVerificationSent(false);
//       Alert.alert('Success', 'Email updated successfully.');
//     } catch (error) {
//       console.error('Email Update Error:', error);
//       Alert.alert('Error', error.message);
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

//       {verificationSent && (
//         <View style={styles.verificationContainer}>
//           <Text style={styles.verificationText}>A verification email has been sent to {newEmail}. Please verify your new email address by clicking the link sent to it.</Text>
//           <Button title="I have verified my email" onPress={updateEmailAfterVerification} />
//         </View>
//       )}
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
//   verificationContainer: {
//     padding: 20,
//     backgroundColor: '#e7f4ff',
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   verificationText: {
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });

// export default UserSettingsScreen;



// UserSettingsScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import EmailChangeComponent from '../components/EmailChangeComponent';

export default function UserSettingsScreen() {
  return (
    <View>
      <Text>User Settings</Text>
      <EmailChangeComponent />
    </View>
  );
}
