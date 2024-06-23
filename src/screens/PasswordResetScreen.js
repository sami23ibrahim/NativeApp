import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../config/firebase'; // Correctly import FIREBASE_AUTH
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the function

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
  }, []);

  const handlePasswordReset = async () => {
    if (!FIREBASE_AUTH) {
      Alert.alert('Error', 'Auth is not initialized');
      return;
    }
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Success', 'Password reset link has been sent to your email.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Password Reset Link" onPress={handlePasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default PasswordResetScreen;
