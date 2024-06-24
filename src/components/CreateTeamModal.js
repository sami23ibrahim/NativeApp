

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH, storage } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const CreateTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamName, setTeamName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const selectImage = async () => {
//     // Ask for permission to access media library
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert("You've refused to allow this app to access your photos!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log('Image Picker Result:', result);

//     if (!result.cancelled) {
//       setImageUri(result.assets[0].uri); // Using result.assets[0].uri for ImagePicker result
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `teams/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         'state_changed',
//         null,
//         (error) => {
//           console.error('Upload failed', error);
//           reject(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const handleCreateTeam = async () => {
//     console.log('Team Name:', teamName);
//     console.log('Image URI:', imageUri);
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       await addDoc(collection(firestore, 'teams'), {
//         name: teamName,
//         admin: user.uid,
//         members: [user.uid],
//         imageUrl: imageUrl,
//       });
//       Alert.alert('Team created successfully!');
//       setVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error creating team: ', error);
//       Alert.alert('Error', 'Failed to create team.');
//     }
//   };

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Create New Team</Text>
//       <TextInput
//         placeholder="Team Name"
//         value={teamName}
//         onChangeText={setTeamName}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={selectImage}>
//         <Image
//           source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//           style={styles.image}
//         />
//       </TouchableOpacity>
//       <Button title="Create Team" onPress={handleCreateTeam} />
//       <Button title="Cancel" onPress={() => setVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
// });

// export default CreateTeamModal;


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getFirestore, collection, addDoc, doc, updateDoc,arrayUnion } from 'firebase/firestore';
// import { FIREBASE_AUTH, storage } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const CreateTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamName, setTeamName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const selectImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       alert("You've refused to allow this app to access your photos!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `teams/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         'state_changed',
//         null,
//         (error) => {
//           console.error('Upload failed', error);
//           reject(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const handleCreateTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       const teamRef = await addDoc(collection(firestore, 'teams'), {
//         name: teamName,
//         imageUrl: imageUrl,
//         owner: { name: user.displayName, uid: user.uid },
//         admins: [{ name: user.displayName, uid: user.uid }],
//         members: [{ name: user.displayName, uid: user.uid }],
//       });
      
//       // Update the user's teams array
//       const userRef = doc(firestore, 'users', user.uid);
//       await updateDoc(userRef, {
//         teams: arrayUnion({
//           teamId: teamRef.id,
//           role: 'owner',
//           name: teamName,
//         })
//       });

//       Alert.alert('Team created successfully!');
//       setVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error creating team: ', error);
//       Alert.alert('Error', 'Failed to create team.');
//     }
//   };

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Create New Team</Text>
//       <TextInput
//         placeholder="Team Name"
//         value={teamName}
//         onChangeText={setTeamName}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={selectImage}>
//         <Image
//           source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//           style={styles.image}
//         />
//       </TouchableOpacity>
//       <Button title="Create Team" onPress={handleCreateTeam} />
//       <Button title="Cancel" onPress={() => setVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
// });

// export default CreateTeamModal;




// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion,getDoc  } from 'firebase/firestore';
// import { FIREBASE_AUTH, storage } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const CreateTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamName, setTeamName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const selectImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       alert("You've refused to allow this app to access your photos!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setImageUri(result.assets[0].uri); // Using result.assets[0].uri for ImagePicker result
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `teams/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         'state_changed',
//         null,
//         (error) => {
//           console.error('Upload failed', error);
//           reject(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const handleCreateTeam = async () => {
//     console.log('Team Name:', teamName);
//     console.log('Image URI:', imageUri);
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
    
//     try {
//       const imageUrl = await uploadImage(imageUri);
      
//       // Fetch user details to get the imageUrl
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       const userImageUrl = userDoc.data().imageUrl;
  
//       const teamRef = await addDoc(collection(firestore, 'teams'), {
//         name: teamName,
//         imageUrl: imageUrl,
//         owner: { name: user.displayName, uid: user.uid, imageUrl: userImageUrl },
//        // admins: [{ name: user.displayName, uid: user.uid, imageUrl: userImageUrl }],
//         members: [{ name: user.displayName, uid: user.uid, imageUrl: userImageUrl, admin: true }],
//       });
  
//       // Add team to user's teams array
//       await updateDoc(doc(firestore, 'users', user.uid), {
//         teams: arrayUnion({
//           teamId: teamRef.id,
//         //  name: teamName,
//          // role: 'owner',
//           uid: user.uid
//         })
//       });
  
//       Alert.alert('Team created successfully!');
//       setVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error creating team: ', error);
//       Alert.alert('Error', 'Failed to create team.');
//     }
//   };
  

//   return (
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Create New Team</Text>
//       <TextInput
//         placeholder="Team Name"
//         value={teamName}
//         onChangeText={setTeamName}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={selectImage}>
//         <Image
//           source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//           style={styles.image}
//         />
//       </TouchableOpacity>
//       <Button title="Create Team" onPress={handleCreateTeam} />
//       <Button title="Cancel" onPress={() => setVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 24,
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
// });

// export default CreateTeamModal;



import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CreateTeamModal = ({ setVisible, refreshTeams }) => {
  const [teamName, setTeamName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri); // Using result.assets[0].uri for ImagePicker result
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `teams/${filename}`);
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
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !imageUri) {
      Alert.alert('Missing information', 'Please provide a team name and select an image.');
      return;
    }
    
    setLoading(true); // Set loading state to true
    try {
      const imageUrl = await uploadImage(imageUri);
      
      // Fetch user details to get the imageUrl
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userImageUrl = userDoc.data().imageUrl;
  
      const teamRef = await addDoc(collection(firestore, 'teams'), {
        name: teamName,
        imageUrl: imageUrl,
        owner: { name: user.displayName, uid: user.uid, imageUrl: userImageUrl },
        members: [{ name: user.displayName, uid: user.uid, imageUrl: userImageUrl, admin: true }],
      });
  
      // Add team to user's teams array
      await updateDoc(doc(firestore, 'users', user.uid), {
        teams: arrayUnion({
          teamId: teamRef.id,
          uid: user.uid
        })
      });
  
      Alert.alert('Team created successfully!');
      setVisible(false);
      refreshTeams();
    } catch (error) {
      console.error('Error creating team: ', error);
      Alert.alert('Error', 'Failed to create team.');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Create New Team</Text>
      <TextInput
        placeholder="Enter Team Name.."
        value={teamName}
        placeholderTextColor='white'
        onChangeText={setTeamName}
        style={styles.input}
        editable={!loading} // Disable input while loading
      />
      <TouchableOpacity onPress={selectImage} disabled={loading}>
        <Image
          source={require('../../assets/addImg.png')} 
          style={styles.image}
        />
      </TouchableOpacity>
      
      {/* <View style={styles.buttonRow}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        
        <Button title="Create" color={'#9cacbc'} onPress={handleCreateTeam} />
      )}
    
      <Button title="Cancel" style={ styles.cancelButton} onPress={() => setVisible(false)} disabled={loading} /> */}

      <View style={styles.buttonRow}>
  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCreateTeam}>
    <Text style={styles.buttonText}>Create</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setVisible(false)} disabled={loading}>
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>
</View>


      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
    padding: 10,
    borderRadius: 5,  justifyContent: 'space-between',
    marginVertical: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 19,
  },
  cancelButton: {
    width:'45%',
    elevation: 5,
    paddingVertical: 10,marginHorizontal: 5, // Add margin between the buttons
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this as needed
    marginTop: 20, // Add some margin to separate from other elements
   
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 8,
    color: 'white',
    width: 200,
  },
  image: {
    width: 123,
    height: 115,
    marginBottom: 20,
    borderRadius:10,

  },
  buttons: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 90,
  },
});

export default CreateTeamModal;
