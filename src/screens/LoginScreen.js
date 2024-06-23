


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



import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebase';
import { getAuth, sendEmailVerification } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        await sendEmailVerification(response.user);
        Alert.alert('Email not verified', 'Please verify your email before signing in. A new verification email has been sent.');
        await auth.signOut(); // Sign out the user
      } else {
        navigation.navigate('Home'); // Navigate to Home screen upon successful login
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Sign in failed: user not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <View style={styles.imagePlaceholder}>
        <Image source={require('../../assets/boxesShelves.png')} style={styles.image} />
          {/* <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} /> */}
          
        </View>

        <View style={styles.imagePlaceholder}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          color="white"
          placeholderTextColor={"white"}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"white"}
           color="white"
          onChangeText={(text) => setPassword(text)}
          
        />
        <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
         </View>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
            
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Create account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
              <Text style={styles.signupText}>Forgot your password?</Text>
            </TouchableOpacity>
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
    backgroundColor: '#9cacbc',
  },
  imagePlaceholder: {
    alignItems: 'center',
    marginBottom: 10,width: '100%',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
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
  },
  signupText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    width:'65%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
