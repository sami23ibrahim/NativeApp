import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image,TouchableOpacity } from 'react-native';
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
      <View style={styles.imagePlaceholder}>
        <Image
         source={require('../../assets/lock.png')}
          style={styles.image}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Password Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#9cacbc',
  },
  imagePlaceholder: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',fontWeight: 'bold',

    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 8,
    width: '88%',
    backgroundColor: '#9cacbc',
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    width: '75%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordResetScreen;
