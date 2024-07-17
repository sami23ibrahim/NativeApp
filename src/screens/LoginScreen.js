


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from 'react-native';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { getAuth, sendEmailVerification } from "firebase/auth";

// const Login = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       const response = await signInWithEmailAndPassword(auth, email, password);
//       if (!response.user.emailVerified) {
//         await sendEmailVerification(response.user);
//         Alert.alert('Email not verified', 'Please verify your email before signing in. A new verification email has been sent.');
//         await auth.signOut(); // Sign out the user
//       } else {
//         console.log(response);
//         navigation.navigate('Home'); // Navigate to MyCategories screen upon successful login
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Sign in failed: user not found');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       const response = await createUserWithEmailAndPassword(auth, email, password);
//       console.log(response);

//       // Add user to Firestore
//       await setDoc(doc(collection(firestore, 'users'), response.user.uid), {
//         uid: response.user.uid,
//         email: response.user.email,
//         roles: [] // Initialize with empty roles array or add default roles if needed
//       });

//       // Send email verification
//       const currentAuth = getAuth();
//       sendEmailVerification(currentAuth.currentUser)
//         .then(() => {
//           alert('Verification email sent!\nPlease check your email.');
//         });
//     } catch (error) {
//       console.log(error);
//       alert('Sign up failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView behavior='padding'>
//         <TextInput
//           value={email}
//           style={styles.input}
//           placeholder="Email"
//           autoCapitalize="none"
//           onChangeText={(text) => setEmail(text)}
//         />
//         <TextInput
//           secureTextEntry={true}
//           value={password}
//           style={styles.input}
//           placeholder="Password"
//           onChangeText={(text) => setPassword(text)}
//         />
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <>
//             <Button title="Login" onPress={signIn} />
//             <Button title="Create account" onPress={signUp} />
//           </>
//         )}
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
// });

// export default Login;
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebase';
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useFocusEffect } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const auth = FIREBASE_AUTH;

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true); // or some other action
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false); // or some other action
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }, [])
  );

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        await sendEmailVerification(response.user);
        Alert.alert('Email not verified', 'Please verify your email before signing in. A new verification email has been sent.');
        await auth.signOut(); // Sign out the user
      } else {
      // navigation.navigate('Home'); // Navigate to Home screen upon successful login
      navigation.navigate('Home', { userName: response.user.displayName || response.user.email }); // Pass userName as parameter
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Sign in failed', 'The password is incorrect.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Sign in failed', 'No user found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Sign in failed', 'The email address is not valid.');
      } else {
        Alert.alert('Sign in failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          {!isKeyboardVisible && (
            <View style={styles.imagePlaceholder}>
              <Image source={require('../../assets/boxesShelves.png')} style={styles.image} />
            </View>
          )}
          <View style={styles.formContainer}>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              color="white"
              placeholderTextColor={"gray"}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"gray"}
              color="white"
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {loading && (
              <ActivityIndicator size="large" color="white" style={styles.loader} />
            )}
            {!loading && (
              <>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupText}>Create account</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
                  <Text style={styles.signupText}>Forgot your password?</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 1,
  },
  image: {
    width: width * 0.95,
    height: width * 0.65,
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Centers children vertically
    width: '100%', // Ensure the form container takes the full width
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding to ensure the button is visible
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 8,
    width: '90%',
    backgroundColor: 'rgba(172, 188, 198, 0.13)',
  },
  signupText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 0.43)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

export default React.memo(Login);
