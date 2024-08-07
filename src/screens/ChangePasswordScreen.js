import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const { width } = Dimensions.get('window');

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [action, setAction] = useState('');
  const auth = getAuth();

  const handleReauthenticate = useCallback(async () => {
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
  }, [auth, currentPassword]);

  const handlePasswordChange = useCallback(() => {
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
  }, [newPassword, confirmNewPassword]);

  const updatePasswordAfterReauthentication = useCallback(async () => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
    } catch (error) {
      console.error('Password Change Error:', error);
      Alert.alert('Error', error.message);
    }
  }, [auth, newPassword]);

  const inputStyle = useMemo(() => [
    styles.input,
    passwordMismatch && { borderColor: 'red' }
  ], [passwordMismatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Password</Text>
      <TextInput
        placeholder=" New Password"
        placeholderTextColor={"gray"}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={inputStyle}
      />
      <TextInput
        placeholder=" Confirm New Password"
        placeholderTextColor={"gray"}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        style={inputStyle}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
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
            placeholder=" Current Password"
            placeholderTextColor={"gray"}
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
    </SafeAreaView>
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
    marginBottom: 40,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 8,
    width: '88%',
    backgroundColor: 'rgba(172, 188, 198, 1.7)',  backgroundColor: 'rgba(172, 188, 198, 0.13)',
    alignSelf: 'center',
    color: 'white',
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
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#9cacbc',
    borderRadius: 20,
    padding: 25,
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
    fontSize: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});

export default ChangePassword;
