// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { getAuth, sendEmailVerification } from "firebase/auth";
// const Login = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;

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
//         navigation.navigate('LogOut'); // Navigate to MyCategories screen upon successful login
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
//         <KeyboardAvoidingView behavior='padding'>
//       <TextInput
//         value={email}
//         style={styles.input}
//         placeholder="Email"
//         autoCapitalize="none"
//         onChangeText={(text) => setEmail(text)}
//       />
//       <TextInput
//         secureTextEntry={true}
//         value={password}
//         style={styles.input}
//         placeholder="Password"
//         onChangeText={(text) => setPassword(text)}
//       />
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Button title="Login" onPress={signIn} />
//           <Button title="Create account" onPress={signUp} />
//         </>
//       )}
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


import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';
import { getAuth, sendEmailVerification } from "firebase/auth";

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const firestore = getFirestore();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        await sendEmailVerification(response.user);
        Alert.alert('Email not verified', 'Please verify your email before signing in. A new verification email has been sent.');
        await auth.signOut(); // Sign out the user
      } else {
        console.log(response);
        navigation.navigate('Home'); // Navigate to MyCategories screen upon successful login
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Sign in failed: user not found');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);

      // Add user to Firestore
      await setDoc(doc(collection(firestore, 'users'), response.user.uid), {
        uid: response.user.uid,
        email: response.user.email,
        roles: [] // Initialize with empty roles array or add default roles if needed
      });

      // Send email verification
      const currentAuth = getAuth();
      sendEmailVerification(currentAuth.currentUser)
        .then(() => {
          alert('Verification email sent!\nPlease check your email.');
        });
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Login;
