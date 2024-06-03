// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';

// const CreateTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamName, setTeamName] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const handleCreateTeam = async () => {
//     try {
//       await addDoc(collection(firestore, 'teams'), {
//         name: teamName,
//         admin: user.uid,
//         members: [user.uid],
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
// });

// export default CreateTeamModal;




// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';

// const CreateTeamModal = ({ setVisible, refreshTeams }) => {
//   const [teamName, setTeamName] = useState('');
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   const handleCreateTeam = async () => {
//     try {
//       await addDoc(collection(firestore, 'teams'), {
//         name: teamName,
//         admin: user.uid,
//         members: [user.uid],
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
// });

// export default CreateTeamModal;


import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CreateTeamModal = ({ setVisible, refreshTeams }) => {
  const [teamName, setTeamName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const selectImage = async () => {
    // Ask for permission to access media library
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

    console.log('Image Picker Result:', result);

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
    console.log('Team Name:', teamName);
    console.log('Image URI:', imageUri);
    if (!teamName.trim() || !imageUri) {
      Alert.alert('Missing information', 'Please provide a team name and select an image.');
      return;
    }
    try {
      const imageUrl = await uploadImage(imageUri);
      await addDoc(collection(firestore, 'teams'), {
        name: teamName,
        admin: user.uid,
        members: [user.uid],
        imageUrl: imageUrl,
      });
      Alert.alert('Team created successfully!');
      setVisible(false);
      refreshTeams();
    } catch (error) {
      console.error('Error creating team: ', error);
      Alert.alert('Error', 'Failed to create team.');
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Create New Team</Text>
      <TextInput
        placeholder="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        style={styles.input}
      />
      <TouchableOpacity onPress={selectImage}>
        <Image
          source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
      </TouchableOpacity>
      <Button title="Create Team" onPress={handleCreateTeam} />
      <Button title="Cancel" onPress={() => setVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 200,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default CreateTeamModal;
