// src/components/ChangePassword.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Modal } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [action, setAction] = useState('');
  const auth = getAuth();

  const handleReauthenticate = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePasswordAfterReauthentication();
      setModalVisible(false);
    } catch (error) {
      console.error('Reauthentication Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      Alert.alert('Error', 'Please enter a valid password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMismatch(true);
      Alert.alert('Error', 'The passwords do not match.');
      return;
    }
    setPasswordMismatch(false);
    setAction('password');
    setModalVisible(true);
  };

  const updatePasswordAfterReauthentication = async () => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
    } catch (error) {
      console.error('Password Change Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Update Password</Text>
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        style={[styles.input, passwordMismatch && { borderColor: 'red' }]}
      />
      <Button title="Update Password" onPress={handlePasswordChange} />
      {passwordMismatch && <Text style={styles.errorText}>The passwords do not match.</Text>}
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

export default ChangePassword;
