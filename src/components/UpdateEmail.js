// src/components/UpdateEmail.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
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
    <View>
      <Text style={styles.title}>Update Email</Text>
      <TextInput
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm New Email"
        value={confirmNewEmail}
        onChangeText={setConfirmNewEmail}
        style={[styles.input, (emailMismatch || emailSameAsCurrent) && { borderColor: 'red' }]}
      />
       <Text style={styles.warningText}>
       Please ensure that you enter a valid email address. Upon confirmation, access will be granted exclusively through the new email, and the previous email will no longer be valid.
       </Text>
      <Button title="Update Email" onPress={handleEmailChange} />
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
  warningText: {
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
      },
  errorText: {
    color: 'red',
    marginBottom: 20,
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

export default UpdateEmail;
