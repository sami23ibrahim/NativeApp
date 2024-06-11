
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const teamsArray = userData.teams || [];

//           // Create a new array to store valid teams
//           const validTeams = [];
          
//           // Check if each team exists
//           for (let team of teamsArray) {
//             const teamRef = doc(firestore, 'teams', team.teamId);
//             const teamDoc = await getDoc(teamRef);
//             if (teamDoc.exists()) {
//               validTeams.push({ id: team.teamId, ...teamDoc.data() });
//             } else {
//               // If team does not exist, remove it from the user's teams array
//               await updateDoc(userDocRef, {
//                 teams: arrayRemove(team)
//               });
//             }
//           }
          
//           setTeams(validTeams);
//         }
//       } catch (error) {
//         console.error('Error fetching teams: ', error);
//       }
//     };

//     fetchTeams();
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const refreshTeams = async () => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teamsArray = userData.teams || [];

//         // Create a new array to store valid teams
//         const validTeams = [];
        
//         // Check if each team exists
//         for (let team of teamsArray) {
//           const teamRef = doc(firestore, 'teams', team.teamId);
//           const teamDoc = await getDoc(teamRef);
//           if (teamDoc.exists()) {
//             validTeams.push({ id: team.teamId, ...teamDoc.data() });
//           } else {
//             // If team does not exist, remove it from the user's teams array
//             await updateDoc(userDocRef, {
//               teams: arrayRemove(team)
//             });
//           }
//         }
        
//         setTeams(validTeams);
//       }
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

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
//       setImageUri(result.assets[0].uri); // Fixing the access to the URI
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

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       await updateDoc(teamRef, {
//         name: teamName,
//         imageUrl: imageUrl,
//       });
//       Alert.alert('Team updated successfully!');
//       setEditTeam(null);
//       setTeamName('');
//       setImageUri('');
//       setModalVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error updating team: ', error);
//       Alert.alert('Error', 'Failed to update team.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeam = async (teamId) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       await deleteDoc(teamRef);
//       Alert.alert('Team deleted successfully!');
//       refreshTeams();
//     } catch (error) {
//       console.error('Error deleting team: ', error);
//       Alert.alert('Error', 'Failed to delete team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => (
//     <View style={styles.teamItemContainer}>
//       <TouchableOpacity
//         style={styles.teamItem}
//         onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//       >
//         <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//         <View style={styles.teamInfo}>
//           <Text style={styles.teamName}>{item.name}</Text>
//           <View style={styles.nameContainer}>
//           <Text style={styles.teamDetail}> {item.owner.name}</Text>
//           {<MaterialCommunityIcons name="crown" size={30} color="gold" style={styles.icon} />}
          
//         </View>

       


          
      
//           <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
//         </View>
//       </TouchableOpacity>
//       <Menu>
//         <MenuTrigger>
//           <Text style={styles.menuButton}>⋮</Text>
//         </MenuTrigger>
//         <MenuOptions>
//           <MenuOption onSelect={() => {
//             setEditTeam(item);
//             setTeamName(item.name); // Set the current team name
//             setImageUri(item.imageUrl); // Set the current team image URL
//             setModalType('edit');
//             setModalVisible(true);
//           }} text="Edit" />
//           <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
//         </MenuOptions>
//       </Menu>
//     </View>
//   );
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MY TEAMS</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTeamItem}
//       />
//       <Button title="Sign Out" onPress={handleSignOut} />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {modalType === 'create' ? (
//           <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : modalType === 'join' ? (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : (
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Edit Team</Text>
//             <TextInput
//               placeholder="Team Name"
//               value={teamName}
//               onChangeText={setTeamName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Update Team" onPress={handleEditTeam} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </>
//             )}
//           </View>
//         )}
//       </Modal>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('create');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Create New Team</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('join');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Join Existing Team</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 6,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   teamImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 25,
//   },
//   teamInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: 22, 
//   },
//   teamDetail: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   icon: {
//     marginLeft: 15,
//   },
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

// export default HomeScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import UserSettingsScreen from './UserSettingsScreen';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const teamsArray = userData.teams || [];

//           const validTeams = [];
          
//           for (let team of teamsArray) {
//             const teamRef = doc(firestore, 'teams', team.teamId);
//             const teamDoc = await getDoc(teamRef);
//             if (teamDoc.exists()) {
//               validTeams.push({ id: team.teamId, ...teamDoc.data() });
//             } else {
//               await updateDoc(userDocRef, {
//                 teams: arrayRemove(team)
//               });
//             }
//           }
          
//           setTeams(validTeams);
//         }
//       } catch (error) {
//         console.error('Error fetching teams: ', error);
//       }
//     };

//     fetchTeams();
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const refreshTeams = async () => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teamsArray = userData.teams || [];

//         const validTeams = [];
        
//         for (let team of teamsArray) {
//           const teamRef = doc(firestore, 'teams', team.teamId);
//           const teamDoc = await getDoc(teamRef);
//           if (teamDoc.exists()) {
//             validTeams.push({ id: team.teamId, ...teamDoc.data() });
//           } else {
//             await updateDoc(userDocRef, {
//               teams: arrayRemove(team)
//             });
//           }
//         }
        
//         setTeams(validTeams);
//       }
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

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
//       setImageUri(result.assets[0].uri); // Fixing the access to the URI
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

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       await updateDoc(teamRef, {
//         name: teamName,
//         imageUrl: imageUrl,
//       });
//       Alert.alert('Team updated successfully!');
//       setEditTeam(null);
//       setTeamName('');
//       setImageUri('');
//       setModalVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error updating team: ', error);
//       Alert.alert('Error', 'Failed to update team.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeam = async (teamId) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();

//         for (const member of teamData.members) {
//           const memberRef = doc(firestore, 'users', member.uid);
//           const memberDoc = await getDoc(memberRef);
//           if (memberDoc.exists()) {
//             const memberData = memberDoc.data();
//             const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
//             await updateDoc(memberRef, { teams: updatedTeams });
//           }
//         }

//         await deleteDoc(teamRef);
//         Alert.alert('Team deleted successfully!');
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//     } catch (error) {
//       console.error('Error deleting team: ', error);
//       Alert.alert('Error', 'Failed to delete team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => (
//     <View style={styles.teamItemContainer}>
//       <TouchableOpacity
//         style={styles.teamItem}
//         onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//       >
//         <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//         <View style={styles.teamInfo}>
//           <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
//           <View style={styles.nameContainer}>
//             <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
//             {/* <MaterialCommunityIcons name="crown" size={30} color="gold" style={styles.icon} /> */}
//           </View>
//           <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
//         </View>
//       </TouchableOpacity>
//       {item.owner.uid === user.uid && (
//         <Menu>
//           <MenuTrigger>
//             <Text style={styles.menuButton}>⋮</Text>
//           </MenuTrigger>
//           <MenuOptions>
//             <MenuOption onSelect={() => {
//               setEditTeam(item);
//               setTeamName(item.name);
//               setImageUri(item.imageUrl);
//               setModalType('edit');
//               setModalVisible(true);
//             }} text="Edit" />
//             <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
//           </MenuOptions>
//         </Menu>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
// <Button title="Settings" onPress={() => navigation.navigate('UserSettingsScreen')} />

//       <Text style={styles.title}>MY TEAMS</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTeamItem}
//       />
//       <Button title="Sign Out" onPress={handleSignOut} />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {modalType === 'create' ? (
//           <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : modalType === 'join' ? (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : (
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Edit Team</Text>
//             <TextInput
//               placeholder="Team Name"
//               value={teamName}
//               onChangeText={setTeamName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Update Team" onPress={handleEditTeam} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </>
//             )}
//           </View>
//         )}
//       </Modal>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('create');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Create New Team</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('join');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Join Existing Team</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 6,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   teamImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 25,
//   },
//   teamInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: 22, 
//   },
//   teamDetail: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   icon: {
//     marginLeft: 15,
//   },
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

// export default HomeScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import UserSettingsScreen from './UserSettingsScreen';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const teamsArray = userData.teams || [];

//           const validTeams = [];

//           for (let team of teamsArray) {
//             const teamRef = doc(firestore, 'teams', team.teamId);
//             const teamDoc = await getDoc(teamRef);
//             if (teamDoc.exists()) {
//               validTeams.push({ id: team.teamId, ...teamDoc.data() });
//             } else {
//               await updateDoc(userDocRef, {
//                 teams: arrayRemove(team)
//               });
//             }
//           }

//           setTeams(validTeams);
//         }
//       } catch (error) {
//         console.error('Error fetching teams: ', error);
//       }
//     };

//     fetchTeams();
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const refreshTeams = async () => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teamsArray = userData.teams || [];

//         const validTeams = [];

//         for (let team of teamsArray) {
//           const teamRef = doc(firestore, 'teams', team.teamId);
//           const teamDoc = await getDoc(teamRef);
//           if (teamDoc.exists()) {
//             validTeams.push({ id: team.teamId, ...teamDoc.data() });
//           } else {
//             await updateDoc(userDocRef, {
//               teams: arrayRemove(team)
//             });
//           }
//         }

//         setTeams(validTeams);
//       }
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

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
//       setImageUri(result.uri); // Fixing the access to the URI
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

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       await updateDoc(teamRef, {
//         name: teamName,
//         imageUrl: imageUrl,
//       });
//       Alert.alert('Team updated successfully!');
//       setEditTeam(null);
//       setTeamName('');
//       setImageUri('');
//       setModalVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error updating team: ', error);
//       Alert.alert('Error', 'Failed to update team.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeam = async (teamId) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();

//         for (const member of teamData.members) {
//           const memberRef = doc(firestore, 'users', member.uid);
//           const memberDoc = await getDoc(memberRef);
//           if (memberDoc.exists()) {
//             const memberData = memberDoc.data();
//             const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
//             await updateDoc(memberRef, { teams: updatedTeams });
//           }
//         }

//         await deleteDoc(teamRef);
//         Alert.alert('Team deleted successfully!');
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//     } catch (error) {
//       console.error('Error deleting team: ', error);
//       Alert.alert('Error', 'Failed to delete team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => (
//     <View style={styles.teamItemContainer}>
//       <TouchableOpacity
//         style={styles.teamItem}
//         onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//       >
//         <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//         <View style={styles.teamInfo}>
//           <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
//           <View style={styles.nameContainer}>
//             <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
//           </View>
//           <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
//         </View>
//       </TouchableOpacity>
//       {item.owner.uid === user.uid && (
//         <Menu>
//           <MenuTrigger>
//             <Text style={styles.menuButton}>⋮</Text>
//           </MenuTrigger>
//           <MenuOptions>
//             <MenuOption onSelect={() => {
//               setEditTeam(item);
//               setTeamName(item.name);
//               setImageUri(item.imageUrl);
//               setModalType('edit');
//               setModalVisible(true);
//             }} text="Edit" />
//             <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
//           </MenuOptions>
//         </Menu>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Button title="Settings" onPress={() => navigation.navigate('UserSettingsScreen')} />

//       <Text style={styles.title}>MY TEAMS</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTeamItem}
//       />
//       <Button title="Sign Out" onPress={handleSignOut} />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {modalType === 'create' ? (
//           <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : modalType === 'join' ? (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : (
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Edit Team</Text>
//             <TextInput
//               placeholder="Team Name"
//               value={teamName}
//               onChangeText={setTeamName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Update Team" onPress={handleEditTeam} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </>
//             )}
//           </View>
//         )}
//       </Modal>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('create');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Create New Team</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('join');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Join Existing Team</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 6,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   teamImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 25,
//   },
//   teamInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: 22, 
//   },
//   teamDetail: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   icon: {
//     marginLeft: 15,
//   },
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

// export default HomeScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import UserSettingsScreen from './UserSettingsScreen';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//    useEffect(() => {
//         const fetchTeams = async () => {
//           try {
//             const userDocRef = doc(firestore, 'users', user.uid);
//             const userDoc = await getDoc(userDocRef);
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               const teamsArray = userData.teams || [];
    
//               // Create a new array to store valid teams
//               const validTeams = [];
              
//               // Check if each team exists
//               for (let team of teamsArray) {
//                 const teamRef = doc(firestore, 'teams', team.teamId);
//                 const teamDoc = await getDoc(teamRef);
//                 if (teamDoc.exists()) {
//                   validTeams.push({ id: team.teamId, ...teamDoc.data() });
//                 } else {
//                   // If team does not exist, remove it from the user's teams array
//                   await updateDoc(userDocRef, {
//                     teams: arrayRemove(team)
//                   });
//                 }
//               }
              
//               setTeams(validTeams);
//             }
//           } catch (error) {
//             console.error('Error fetching teams: ', error);
//           }
//         };
    
//         fetchTeams();
//       }, [user]);
    
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//     const refreshTeams = async () => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teamsArray = userData.teams || [];

//         // Create a new array to store valid teams
//         const validTeams = [];
        
//         // Check if each team exists
//         for (let team of teamsArray) {
//           const teamRef = doc(firestore, 'teams', team.teamId);
//           const teamDoc = await getDoc(teamRef);
//           if (teamDoc.exists()) {
//             validTeams.push({ id: team.teamId, ...teamDoc.data() });
//           } else {
//             // If team does not exist, remove it from the user's teams array
//             await updateDoc(userDocRef, {
//               teams: arrayRemove(team)
//             });
//           }
//         }
        
//         setTeams(validTeams);
//       }
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

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
//       setImageUri(result.uri); // Fixing the access to the URI
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

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       await updateDoc(teamRef, {
//         name: teamName,
//         imageUrl: imageUrl,
//       });
//       Alert.alert('Team updated successfully!');
//       setEditTeam(null);
//       setTeamName('');
//       setImageUri('');
//       setModalVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error updating team: ', error);
//       Alert.alert('Error', 'Failed to update team.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeam = async (teamId) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();

//         // Remove the team from all members' team lists
//         for (const member of teamData.members) {
//           const memberRef = doc(firestore, 'users', member.uid);
//           const memberDoc = await getDoc(memberRef);
//           if (memberDoc.exists()) {
//             const memberData = memberDoc.data();
//             const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
//             await updateDoc(memberRef, { teams: updatedTeams });
//           }
//         }

//         // Delete the team document
//         await deleteDoc(teamRef);
//         Alert.alert('Team deleted successfully!');
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//     } catch (error) {
//       console.error('Error deleting team: ', error);
//       Alert.alert('Error', 'Failed to delete team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => {
//     console.log('Rendering team item:', item); // Debug log
//     return (
//       <View style={styles.teamItemContainer}>
//         <Text style={styles.teamDetail}></Text>
//         <TouchableOpacity
//           style={styles.teamItem}
//           onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//         >
//           <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//           <View style={styles.teamInfo}>
//             <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
//             <View style={styles.nameContainer}>
//               <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
//             </View>
//             <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
//           </View>
//         </TouchableOpacity>
//         {item.owner.uid === user.uid && (
//           <Menu>
//             <MenuTrigger>
//               <Text style={styles.menuButton}>⋮</Text>
//             </MenuTrigger>
//             <MenuOptions>
//               <MenuOption onSelect={() => {
//                 setEditTeam(item);
//                 setTeamName(item.name);
//                 setImageUri(item.imageUrl);
//                 setModalType('edit');
//                 setModalVisible(true);
//               }} text="Edit" />
//               <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
//             </MenuOptions>
//           </Menu>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Settings" onPress={() => navigation.navigate('UserSettingsScreen')} />
//       <Text style={styles.title}>MY TEAMS</Text>
//       {teams.length === 0 ? (
//         <Text>No teams to display.</Text>
//       ) : (
//         <FlatList
//           data={teams}
//           keyExtractor={(item) => item.id}
//           renderItem={renderTeamItem}
//         />
//       )}
//       <Button title="Sign Out" onPress={handleSignOut} />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {modalType === 'create' ? (
//           <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : modalType === 'join' ? (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : (
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Edit Team</Text>
//             <TextInput
//               placeholder="Team Name"
//               value={teamName}
//               onChangeText={setTeamName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Update Team" onPress={handleEditTeam} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </>
//             )}
//           </View>
//         )}
//       </Modal>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('create');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Create New Team</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setModalType('join');
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.buttonText}>Join Existing Team</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 6,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   teamImage: {
//     width: 130,
//     height: 130,
//     borderRadius: 25,
//   },
//   teamInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: 22, 
//   },
//   teamDetail: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   icon: {
//     marginLeft: 15,
//   },
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

// export default HomeScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
import CreateTeamModal from '../components/CreateTeamModal';
import JoinTeamModal from '../components/JoinTeamModal';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import UserSettingsScreen from './UserSettingsScreen';

const HomeScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
  const [editTeam, setEditTeam] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const firestore = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const teamsArray = userData.teams || [];

          // Create a new array to store valid teams
          const validTeams = [];

          // Check if each team exists
          for (let team of teamsArray) {
            const teamRef = doc(firestore, 'teams', team.teamId);
            const teamDoc = await getDoc(teamRef);
            if (teamDoc.exists()) {
              validTeams.push({ id: team.teamId, ...teamDoc.data() });
            } else {
              // If team does not exist, remove it from the user's teams array
              await updateDoc(userDocRef, {
                teams: arrayRemove(team)
              });
            }
          }

          setTeams(validTeams);
        }
      } catch (error) {
        console.error('Error fetching teams: ', error);
      }
    };

    fetchTeams();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshTeams = async () => {
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const teamsArray = userData.teams || [];

        // Create a new array to store valid teams
        const validTeams = [];

        // Check if each team exists
        for (let team of teamsArray) {
          const teamRef = doc(firestore, 'teams', team.teamId);
          const teamDoc = await getDoc(teamRef);
          if (teamDoc.exists()) {
            validTeams.push({ id: team.teamId, ...teamDoc.data() });
          } else {
            // If team does not exist, remove it from the user's teams array
            await updateDoc(userDocRef, {
              teams: arrayRemove(team)
            });
          }
        }

        setTeams(validTeams);
      }
    } catch (error) {
      console.error('Error refreshing teams: ', error);
    }
  };

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

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Fixing the access to the URI
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

  const handleEditTeam = async () => {
    if (!teamName.trim() || !imageUri) {
      Alert.alert('Missing information', 'Please provide a team name and select an image.');
      return;
    }
    setLoading(true);
    try {
      const teamRef = doc(firestore, 'teams', editTeam.id);
      const teamDoc = await getDoc(teamRef);
  
      // Get the current image URL
      const currentImageUrl = teamDoc.data().imageUrl;
  
      // Upload the new image
      const imageUrl = await uploadImage(imageUri);
  
      // Delete the old image if it exists
      if (currentImageUrl) {
        const oldImageRef = ref(storage, currentImageUrl);
        await deleteObject(oldImageRef);
      }
  
      // Update the team document with the new image URL
      await updateDoc(teamRef, {
        name: teamName,
        imageUrl: imageUrl,
      });
  
      Alert.alert('Team updated successfully!');
      setEditTeam(null);
      setTeamName('');
      setImageUri('');
      setModalVisible(false);
      refreshTeams();
    } catch (error) {
      console.error('Error updating team: ', error);
      Alert.alert('Error', 'Failed to update team.');
    } finally {
      setLoading(false);
    }
  };
  

  // const handleDeleteTeam = async (teamId) => {
  //   try {
  //     const teamRef = doc(firestore, 'teams', teamId);
  //     const teamDoc = await getDoc(teamRef);
  //     if (teamDoc.exists()) {
  //       const teamData = teamDoc.data();
  
  //       // Remove the team from all members' team lists
  //       for (const member of teamData.members) {
  //         const memberRef = doc(firestore, 'users', member.uid);
  //         const memberDoc = await getDoc(memberRef);
  //         if (memberDoc.exists()) {
  //           const memberData = memberDoc.data();
  //           const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
  //           await updateDoc(memberRef, { teams: updatedTeams });
  //         }
  //       }
  
  //       // Delete associated categories and items
  //       const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
  //       for (const categoryDoc of categoriesQuerySnapshot.docs) {
  //         const categoryData = categoryDoc.data();
  //         if (categoryData.teamId === teamId) {
  //           const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
  //           for (const itemDoc of itemsQuerySnapshot.docs) {
  //             // Delete item document and associated image
  //             await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
  //             const itemData = itemDoc.data();
  //             if (itemData.img) {
  //               const imgRef = ref(storage, itemData.img);
  //               await deleteObject(imgRef);
  //             }
  //           }
  //           // Delete category document
  //           await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
  //         }
  //       }
  
  //       // Delete the team document
  //       await deleteDoc(teamRef);
  //       Alert.alert('Team deleted successfully!');
  //       refreshTeams();
  //     } else {
  //       Alert.alert('Error', 'Team not found.');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting team: ', error);
  //     Alert.alert('Error', 'Failed to delete team.');
  //   }
  // };
  

  const handleDeleteTeam = async (teamId) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
  
        // Remove the team from all members' team lists
        for (const member of teamData.members) {
          const memberRef = doc(firestore, 'users', member.uid);
          const memberDoc = await getDoc(memberRef);
          if (memberDoc.exists()) {
            const memberData = memberDoc.data();
            const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
            await updateDoc(memberRef, { teams: updatedTeams });
          }
        }
  
        // Delete associated categories and items
        const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
        for (const categoryDoc of categoriesQuerySnapshot.docs) {
          const categoryData = categoryDoc.data();
          if (categoryData.teamId === teamId) {
            const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
            for (const itemDoc of itemsQuerySnapshot.docs) {
              // Delete item document and associated image
              await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
              const itemData = itemDoc.data();
              if (itemData.img) {
                const imgRef = ref(storage, itemData.img);
                await deleteObject(imgRef);
              }
            }
            // Delete category document and associated image
            if (categoryData.img) {
              const categoryImgRef = ref(storage, categoryData.img);
              await deleteObject(categoryImgRef);
            }
            await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
          }
        }
  
        // Delete team document and associated image
        if (teamData.imageUrl) {
          const teamImgRef = ref(storage, teamData.imageUrl);
          await deleteObject(teamImgRef);
        }
        await deleteDoc(teamRef);
  
        Alert.alert('Team deleted successfully!');
        refreshTeams();
      } else {
        Alert.alert('Error', 'Team not found.');
      }
    } catch (error) {
      console.error('Error deleting team: ', error);
      Alert.alert('Error', 'Failed to delete team.');
    }
  };
  
  

  const handleLeaveTeam = async (teamId) => {
    try {
      // Remove the team from the user's team list
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
        await updateDoc(userDocRef, { teams: updatedTeams });
      }

      // Remove the user from the team's member list
      const teamRef = doc(firestore, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
        await updateDoc(teamRef, { members: updatedMembers });
      }

      Alert.alert('You have left the team.');
      refreshTeams();
    } catch (error) {
      console.error('Error leaving team: ', error);
      Alert.alert('Error', 'Failed to leave team.');
    }
  };

  const renderTeamItem = ({ item }) => {
    const isOwner = item.owner.uid === user.uid;

    return (
      <View style={styles.teamItemContainer}>
        <Text style={styles.teamDetail}></Text>
        <TouchableOpacity
          style={styles.teamItem}
          onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
            <View style={styles.nameContainer}>
              <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
          </View>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <Text style={styles.menuButton}>⋮</Text>
          </MenuTrigger>
          <MenuOptions>
            {isOwner ? (
              <>
                <MenuOption onSelect={() => {
                  setEditTeam(item);
                  setTeamName(item.name);
                  setImageUri(item.imageUrl);
                  setModalType('edit');
                  setModalVisible(true);
                }} text="Edit" />
                <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
              </>
            ) : (
              <MenuOption onSelect={() => handleLeaveTeam(item.id)} text="Leave Team" />
            )}
          </MenuOptions>
        </Menu>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Settings" onPress={() => navigation.navigate('UserSettingsScreen')} />
      <Text style={styles.title}>MY TEAMS</Text>
      {teams.length === 0 ? (
        <Text>No teams to display.</Text>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamItem}
        />
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {modalType === 'create' ? (
          <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
        ) : modalType === 'join' ? (
          <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Team</Text>
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
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Button title="Update Team" onPress={handleEditTeam} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        )}
      </Modal>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalType('create');
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Create New Team</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalType('join');
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Join Existing Team</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  teamItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamImage: {
    width: 130,
    height: 130,
    borderRadius: 25,
  },
  teamInfo: {
    marginLeft: 16,
    flex: 1,
  },
  teamName: {
    fontWeight: 'bold',
    fontSize: 22, 
  },
  teamDetail: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  menuButton: {
    fontSize: 30,
    padding: 10,
  },
  icon: {
    marginLeft: 15,
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

export default HomeScreen;
