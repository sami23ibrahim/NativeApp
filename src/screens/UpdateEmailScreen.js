import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getAuth, updateEmail, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../config/firebase';

const UpdateEmail = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [emailSameAsCurrent, setEmailSameAsCurrent] = useState(false);
  const [action, setAction] = useState('');
  const auth = getAuth();

  const handleReauthenticate = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmailAfterReauthentication();
      setModalVisible(false);
    } catch (error) {
      console.error('Reauthentication Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleEmailChange = () => {
    const user = auth.currentUser;
    if (newEmail.trim() === '' || confirmNewEmail.trim() === '') {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (newEmail !== confirmNewEmail) {
      setEmailMismatch(true);
      Alert.alert('Error', 'The email addresses do not match.');
      return;
    }
    if (newEmail === user.email) {
      setEmailSameAsCurrent(true);
      Alert.alert('Error', 'This email is already in use for this account.');
      return;
    }
    setEmailMismatch(false);
    setEmailSameAsCurrent(false);
    setAction('email');
    setModalVisible(true);
  };

  const updateEmailAfterReauthentication = async () => {
    try {
      const user = auth.currentUser;
      await updateEmail(user, newEmail);
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { email: newEmail });
      await signOut(auth);
      navigation.navigate('Login');
      Alert.alert('Success', 'Email updated successfully. Please sign in with your new email.');
    } catch (error) {
      console.error('Email Update Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Email</Text>
      <TextInput
        placeholder=" New Email"
        placeholderTextColor="gray"
        value={newEmail}
        onChangeText={setNewEmail}
        style={[styles.input, (emailMismatch || emailSameAsCurrent) && { borderColor: 'red' }]}
      />
      <TextInput
        placeholder=" Confirm New Email"
        placeholderTextColor="gray"
        value={confirmNewEmail}
        onChangeText={setConfirmNewEmail}
        style={[styles.input, (emailMismatch || emailSameAsCurrent) && { borderColor: 'red' }]}
      />
      <Text style={styles.warningText}>
        Please ensure that you enter a valid email address. Upon confirmation, access will be granted exclusively through the new email, and the previous email will no longer be valid.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleEmailChange}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>
      {emailMismatch && <Text style={styles.errorText}>The email addresses do not match.</Text>}
      {emailSameAsCurrent && <Text style={styles.errorText}>This email is already in use for this account.</Text>}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Please reauthenticate to proceed</Text>
          <TextInput
            placeholder=" Current Password"
            placeholderTextColor="gray"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleReauthenticate}>
              <Text style={styles.buttonText}>Reauthenticate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: 'rgba(172, 188, 198, 0.13)',
    borderWidth: 1.3,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 8,
    color: 'white',
    width: '88%',
    alignSelf: 'center',
  },
  warningText: {
    color: 'red',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
    width: '88%',
    alignSelf: 'center',
  },
  button: {
    width: '65%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',  backgroundColor: 'rgba(172, 188, 198, 0.13)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#9cacbc',
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
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    elevation: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
  },
});

export default UpdateEmail;
