import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Modal } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false); // State for image picker modal
  const auth = FIREBASE_AUTH;
  const firestore = getFirestore();

  const selectImage = async (source) => {
    setImagePickerModalVisible(false);
    let result;

    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, uid) => {
    if (!uri) return null;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `users/${uid}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Upload failed', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const signUp = async () => {
    if (!username || !email || !password || !imageUri) {
      Alert.alert('Error', 'Please fill out all fields and select an image.');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const imageUrl = await uploadImage(imageUri, response.user.uid);

      await updateProfile(response.user, { displayName: username, photoURL: imageUrl });
      console.log('Profile updated');

      await setDoc(doc(collection(firestore, 'users'), response.user.uid), {
        uid: response.user.uid,
        email: response.user.email,
        username: username,
        imageUrl: imageUrl,
        teams: [],
        notifications: []
      });
      console.log('User document created in Firestore');

      await sendEmailVerification(response.user);
      console.log('Verification email sent');
      
      Alert.alert('Verification email sent!\nPlease check your email.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign up failed:', error);
      Alert.alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity onPress={() => setImagePickerModalVisible(true)} style={styles.imagePlaceholder}>
          <Image   
            source={imageUri ? { uri: imageUri } : require('../../assets/add.png')}
            style={styles.image} 
          />
        </TouchableOpacity>
        <TextInput
          value={username}
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          placeholderTextColor="white"
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          placeholderTextColor="white"
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          placeholderTextColor="white"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>

      <Modal
        transparent={true}
        visible={imagePickerModalVisible}
        animationType="slide"
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>Select Image</Text>
            <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
            <View style={styles.imagePickerOptions}>
              <TouchableOpacity onPress={() => selectImage('camera')}>
                <Text style={styles.imagePickerOptionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectImage('library')}>
                <Text style={styles.imagePickerOptionText}>Library</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
                <Text style={styles.imagePickerOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#9cacbc',
  },
  imagePlaceholder: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 0,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
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
    width: '65%',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerModal: {
    width: '80%',
    backgroundColor: 'rgba(172, 188, 198, 1.1)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  imagePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  imagePickerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  imagePickerOptions: {
    width: '100%',
  },
  imagePickerOptionText: {
    fontSize: 18,
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
