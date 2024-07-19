// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import LottieView from 'lottie-react-native'; // Import LottieView
// import NotificationBadge from '../components/NotificationBadge'; // Ensure this import is correct

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [teamToDelete, setTeamToDelete] = useState(null);
//   const [loadingTeams, setLoadingTeams] = useState(true); // New state for loading teams
//   const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false); // State for image picker modal
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   const buttons = [
//     {
//       iconName: 'account-cog',
//       label: '  Account ',
//       onPress: () => navigation.navigate('UserSettingsScreen'),
//     },
//     {
//       iconName: 'account-multiple-plus',
//       label: 'Create Team',
//       onPress:() => {
//         setModalType('create');
//         setModalVisible(true);
//       }
//     },
//     {
//       iconName: 'location-enter',
//       label: 'Join Team',
//       onPress:() => {
//         setModalType('join');
//         setModalVisible(true);
//       }
//     },
//   ];

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
//       } finally {
//         setTimeout(() => setLoadingTeams(false), 100); // Ensure loading screen stays for at least 3 seconds
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

//   const selectImage = async (source) => {
//     setImagePickerModalVisible(false);
//     let result;

//     if (source === 'camera') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     }

//     if (!result.canceled) {
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

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       const teamDoc = await getDoc(teamRef);

//       // Get the current image URL
//       const currentImageUrl = teamDoc.data().imageUrl;

//       // Upload the new image
//       const imageUrl = await uploadImage(imageUri);

//       // Delete the old image if it exists
//       if (currentImageUrl) {
//         const oldImageRef = ref(storage, currentImageUrl);
//         await deleteObject(oldImageRef);
//       }

//       // Update the team document with the new image URL
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

//   const confirmDeleteTeam = (teamId) => {
//     setTeamToDelete(teamId);
//     setIsDeleteModalVisible(true);
//   };

//   const handleDeleteTeam = async () => {
//     setIsDeleteModalVisible(false);
//     const teamId = teamToDelete;
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

//         // Delete associated categories and items
//         const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
//         for (const categoryDoc of categoriesQuerySnapshot.docs) {
//           const categoryData = categoryDoc.data();
//           if (categoryData.teamId === teamId) {
//             const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
//             for (const itemDoc of itemsQuerySnapshot.docs) {
//               // Delete item document and associated image
//               await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
//               const itemData = itemDoc.data();
//               if (itemData.img) {
//                 const imgRef = ref(storage, itemData.img);
//                 await deleteObject(imgRef);
//               }
//             }
//             // Delete category document and associated image
//             if (categoryData.img) {
//               const categoryImgRef = ref(storage, categoryData.img);
//               await deleteObject(categoryImgRef);
//             }
//             await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
//           }
//         }

//         // Delete team document and associated image
//         if (teamData.imageUrl) {
//           const teamImgRef = ref(storage, teamData.imageUrl);
//           await deleteObject(teamImgRef);
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

//   const handleLeaveTeam = async (teamId) => {
//     try {
//       // Remove the team from the user's team list
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
//         await updateDoc(userDocRef, { teams: updatedTeams });
//       }

//       // Remove the user from the team's member list
//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();
//         const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
//         await updateDoc(teamRef, { members: updatedMembers });
//       }

//       Alert.alert('You have left the team.');
//       refreshTeams();
//     } catch (error) {
//       console.error('Error leaving team: ', error);
//       Alert.alert('Error', 'Failed to leave team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => {
//     const isOwner = item.owner.uid === user.uid;

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
//             <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
//           </View>
//         </TouchableOpacity>
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons 
//               style={styles.menuButton} 
//               name="cog" size={24} color="white" 
//             />
//           </MenuTrigger>
//           <MenuOptions
//             customStyles={{
//               optionsContainer: {
//                 backgroundColor: '#9cacbc',
//                 paddingVertical: 10,
//                 borderRadius: 20,
//                 paddingHorizontal: 15,
//                 backgroundColor: 'rgba(172, 188, 198, 1.7)',
//                 fontSize: 28,
//                 color: 'white',
//               },
//             }}
//           >
//             {isOwner ? (
//               <>
//                 <MenuOption
//                   onSelect={() => {
//                     setEditTeam(item);
//                     setTeamName(item.name);
//                     setImageUri(item.imageUrl);
//                     setModalType('edit');
//                     setModalVisible(true);
//                   }}
//                   text="Edit"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => confirmDeleteTeam(item.id)}
//                   text="Delete"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             ) : (
//               <>
//                 <MenuOption
//                   onSelect={() => handleLeaveTeam(item.id)}
//                   text="Leave Team"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             )}
//           </MenuOptions>
//         </Menu>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
 
//       <View style={styles.listContainer}>
//         {loadingTeams ? (
//           <View style={styles.loadingContainer}>
//             <LottieView
//               source={require('../../assets/loading4.json')} 
//               autoPlay
//               loop
//               style={styles.lottieAnimation}
//             />
//           </View>
//         ) : (
//           <>
//             {teams.length === 0 ? (
//               <View style={styles.noTeamsContainer}>
//                 <Text style={styles.noTeamsText}>
//                   You are not currently a member of any teams. Please join an existing team or create your own!
//                 </Text>
//                 <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
//               </View>
//             ) : (
//               <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
//             )}
//           </>
//         )}
//       </View>
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
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalTitle}>Edit Team</Text>
//               <TextInput
//                 placeholder="Team Name"
//                 value={teamName}
//                 onChangeText={setTeamName}
//                 placeholderTextColor={"white"}
//                 style={styles.input}
//               />
//               <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
//                 <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
//               </TouchableOpacity>
//               {loading ? (
//                 <ActivityIndicator size="large" color="white" />
//               ) : (
//                 <>
//                   <View style={styles.buttonRow}>
//                     <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
//                       <Text style={styles.buttonText}>Update</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(false)}>
//                       <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}
//             </View>
//           </View>
//         )}
//       </Modal>
//       <Modal
//   transparent={true}
//   visible={imagePickerModalVisible}
//   animationType="slide"
//   onRequestClose={() => setImagePickerModalVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.imagePickerModal}>
//       <Text style={styles.imagePickerTitle}>Select Image</Text>
//       <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
//       <View style={styles.imagePickerOptions}>
//         <TouchableOpacity onPress={() => selectImage('camera')}>
//           <Text style={styles.imagePickerOptionText}>Camera</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => selectImage('library')}>
//           <Text style={styles.imagePickerOptionText}>Library</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
//           <Text style={styles.imagePickerOptionText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isDeleteModalVisible}
//         onRequestClose={() => setIsDeleteModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Warning</Text>
//             <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
//                 <Text style={styles.buttonText}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsDeleteModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <ButtonTools buttons={buttons} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'right',
//     alignItems: 'center',
//     padding: 6,
//     backgroundColor: '#9cacbc', // Change this to your desired background color
//   },
  
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Adjust this as needed
//     marginTop: 20, // Add some margin to separate from other elements
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'right',
//     padding: 16,
//     backgroundColor: 'gray',
//   },
//   badge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'right',
//     alignItems: 'center',
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     padding: 10,
//     borderRadius: 5,  justifyContent: 'space-between',
//     marginVertical: 2,
//   },
//   primaryButton: {
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list  
//     marginHorizontal: 5, // Add margin between the buttons
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 19,fontWeight: 'bold',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 8,
//     color: '#f0f0f0',
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',  alignSelf: 'center', // Center the item container
//     padding: 5,
//     marginVertical: 7, // Add margin to create space between items
//     backgroundColor: 'rgba(172, 188, 198, 0.33)', // Set background color with transparency (0.7 for 70% opacity)
//     borderRadius: 30, // Add rounded corners
//   },
//   noTeamsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noTeamsImage: {
//     width: 300,
//     height: 460,
//     marginBottom: 10, borderRadius: 30
//   },
//   noTeamsText: {
//     fontSize: 25,
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 30,
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
//     color: '#f0f0f0',
//   },
//   teamDetail: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: 6,
//   },
//   teamMembersDetail: {
//     fontSize: 15,
//     //fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: 6,
//   },
//   menuButton: {
//     color: 'white',
//     fontSize: 28,
//     padding:16,
//   },
//   icon: {
//     marginLeft: 15,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: 1,
//     fontSize: 24,
//   },
//   lottieAnimation: {
//     width: 350,
//     height: 350,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: 40,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',color: 'white',
//     marginBottom: 10,
//   },
//   modalText: {
//     color: 'white',
//     fontSize: 26,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   deleteButton: {
//     width:'45%',
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     marginHorizontal: 5, // Add margin between the buttons
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//   },
//   cancelButton: {
//     width:'45%',
//     elevation: 5,
//     paddingVertical: 10,marginHorizontal: 5, // Add margin between the buttons
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1.4,
//     borderRadius: 20,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,color: 'white',
//   },
//   image: {
//     width: 150,borderRadius: 30,
//     height: 150,
//     marginBottom: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePickerModal: {
//     width: '80%',
//     backgroundColor: 'rgba(172, 188, 198, 1.1)',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   imagePickerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 10,
//   },
//   imagePickerSubtitle: {
//     fontSize: 16,
//     color: 'white',
//     marginBottom: 20,
//   },
//   imagePickerOptions: {
//     width: '100%',
//   },
//   imagePickerOptionText: {
//     fontSize: 21,
//     color: 'white',
//     padding: 8,
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;

    



//********************************************************************************************************************************* */



// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, 
//   Alert, ActivityIndicator, SafeAreaView, Dimensions 
// } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import LottieView from 'lottie-react-native';
// import NotificationBadge from '../components/NotificationBadge';
// import ButtonTools from '../components/ButtonTools';
// import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary
// // Add scaleSize function
// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const guidelineBaseWidth = 375;

// const scaleSize = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [teamToDelete, setTeamToDelete] = useState(null);
//   const [loadingTeams, setLoadingTeams] = useState(true);
//   const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   const buttons = [
//     {
//       iconName: 'account-cog',
//       label: '  Account ',
//       onPress: () => navigation.navigate('UserSettingsScreen'),
//     },
//     {
//       iconName: 'account-multiple-plus',
//       label: 'Create Team',
//       onPress:() => {
//         setModalType('create');
//         setModalVisible(true);
//       }
//     },
//     {
//       iconName: 'location-enter',
//       label: 'Join Team',
//       onPress:() => {
//         setModalType('join');
//         setModalVisible(true);
//       }
//     },
//   ];

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
//       } finally {
//         setTimeout(() => setLoadingTeams(false), 100);
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

//   const refreshTeams = useCallback(async () => {
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
//   }, [firestore, user.uid]);

//   const selectImage = useCallback(async (source) => {
//     setImagePickerModalVisible(false);
//     let result;

//     if (source === 'camera') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     }

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   }, []);
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
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       const teamDoc = await getDoc(teamRef);

//       const currentImageUrl = teamDoc.data().imageUrl;

//       const imageUrl = await uploadImage(imageUri);

//       if (currentImageUrl) {
//         const oldImageRef = ref(storage, currentImageUrl);
//         await deleteObject(oldImageRef);
//       }

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

//   const confirmDeleteTeam = (teamId) => {
//     setTeamToDelete(teamId);
//     setIsDeleteModalVisible(true);
//   };

//   const handleDeleteTeam = async () => {
//     setIsDeleteModalVisible(false);
//     const teamId = teamToDelete;
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

//         const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
//         for (const categoryDoc of categoriesQuerySnapshot.docs) {
//           const categoryData = categoryDoc.data();
//           if (categoryData.teamId === teamId) {
//             const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
//             for (const itemDoc of itemsQuerySnapshot.docs) {
//               await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
//               const itemData = itemDoc.data();
//               if (itemData.img) {
//                 const imgRef = ref(storage, itemData.img);
//                 await deleteObject(imgRef);
//               }
//             }
//             if (categoryData.img) {
//               const categoryImgRef = ref(storage, categoryData.img);
//               await deleteObject(categoryImgRef);
//             }
//             await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
//           }
//         }

//         if (teamData.imageUrl) {
//           const teamImgRef = ref(storage, teamData.imageUrl);
//           await deleteObject(teamImgRef);
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

//   const handleLeaveTeam = async (teamId) => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
//         await updateDoc(userDocRef, { teams: updatedTeams });
//       }

//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();
//         const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
//         await updateDoc(teamRef, { members: updatedMembers });
//       }

//       Alert.alert('You have left the team.');
//       refreshTeams();
//     } catch (error) {
//       console.error('Error leaving team: ', error);
//       Alert.alert('Error', 'Failed to leave team.');
//     }
//   };

//   const renderTeamItem = ({ item }) => {
//     const isOwner = item.owner.uid === user.uid;

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
//             <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
//           </View>
//         </TouchableOpacity>
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons 
//               style={styles.menuButton} 
//               name="cog" size={24} color="white" 
//             />
//           </MenuTrigger>
//           <MenuOptions
//             customStyles={{
//               optionsContainer: {
//                 backgroundColor: '#9cacbc',
//                 paddingVertical: 10,
//                 borderRadius: 20,
//                 paddingHorizontal: 15,
//                 backgroundColor: 'rgba(172, 188, 198, 1.7)',
//                 fontSize: 28,
//                 color: 'white',
//               },
//             }}
//           >
//             {isOwner ? (
//               <>
//                 <MenuOption
//                   onSelect={() => {
//                     setEditTeam(item);
//                     setTeamName(item.name);
//                     setImageUri(item.imageUrl);
//                     setModalType('edit');
//                     setModalVisible(true);
//                   }}
//                   text="Edit"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => confirmDeleteTeam(item.id)}
//                   text="Delete"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             ) : (
//               <>
//                 <MenuOption
//                   onSelect={() => handleLeaveTeam(item.id)}
//                   text="Leave Team"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             )}
//           </MenuOptions>
//         </Menu>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.listContainer}>
//         {loadingTeams ? (
//           <View style={styles.loadingContainer}>
//             <LottieView
//               source={require('../../assets/loading4.json')} 
//               autoPlay
//               loop
//               style={styles.lottieAnimation}
//             />
//           </View>
//         ) : (
//           <>
//             {teams.length === 0 ? (
//               <View style={styles.noTeamsContainer}>
//                 <Text style={styles.noTeamsText}>
//                   You are not currently a member of any teams. Please join an existing team or create your own!
//                 </Text>
//                 <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
//               </View>
//             ) : (
//               <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
//             )}
//           </>
//         )}
//       </View>
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
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalTitle}>Edit Team</Text>
//               <TextInput
//                 placeholder="Team Name"
//                 value={teamName}
//                 onChangeText={setTeamName}
//                 placeholderTextColor={"white"}
//                 style={styles.input}
//               />
//               <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
//                 <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
//               </TouchableOpacity>
//               {loading ? (
//                 <ActivityIndicator size="large" color="white" />
//               ) : (
//                 <>
//                   <View style={styles.buttonRow}>
//                     <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
//                       <Text style={styles.buttonText}>Update</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(false)}>
//                       <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}
//             </View>
//           </View>
//         )}
//       </Modal>

//       <Modal
//         transparent={true}
//         visible={imagePickerModalVisible}
//         animationType="slide"
//         onRequestClose={() => setImagePickerModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.imagePickerModal}>
//             <Text style={styles.imagePickerTitle}>Select Image</Text>
//             <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
//             <View style={styles.imagePickerOptions}>
//               <TouchableOpacity onPress={() => selectImage('camera')}>
//                 <Text style={styles.imagePickerOptionText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => selectImage('library')}>
//                 <Text style={styles.imagePickerOptionText}>Library</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
//                 <Text style={styles.imagePickerOptionText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isDeleteModalVisible}
//         onRequestClose={() => setIsDeleteModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Warning</Text>
//             <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
//                 <Text style={styles.buttonText}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsDeleteModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <ButtonTools buttons={buttons} />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     alignItems: 'center',
//     padding: scaleSize(6), // Applied scaleSize
//     backgroundColor: '#9cacbc',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: scaleSize(20), // Applied scaleSize
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     padding: scaleSize(16), // Applied scaleSize
//     backgroundColor: 'gray',
//   },
//   badge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: 'red',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     width: scaleSize(20), // Applied scaleSize
//     height: scaleSize(20), // Applied scaleSize
//     justifyContent: 'center', // Changed from 'right' to 'center' for correct Flexbox alignment
//     alignItems: 'center',
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   button: {
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     padding: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(5), // Applied scaleSize
//     justifyContent: 'space-between',
//     marginVertical: scaleSize(2), // Applied scaleSize
//   },
//   primaryButton: {
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: scaleSize(19), // Applied scaleSize
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     fontWeight: 'bold',
//     marginVertical: scaleSize(8), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center',
//     padding: scaleSize(5), // Applied scaleSize
//     marginVertical: scaleSize(7), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 0.33)',
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noTeamsImage: {
//     width: scaleSize(300), // Applied scaleSize
//     height: scaleSize(460), // Applied scaleSize
//     marginBottom: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsText: {
//     fontSize: scaleSize(25), // Applied scaleSize
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: scaleSize(30), // Applied scaleSize
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
//     width: scaleSize(130), // Applied scaleSize
//     height: scaleSize(130), // Applied scaleSize
//     borderRadius: scaleSize(25), // Applied scaleSize
//   },
//   teamInfo: {
//     marginLeft: scaleSize(16), // Applied scaleSize
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: scaleSize(22), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamDetail: {
//     fontSize: scaleSize(18), // Applied scaleSize
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   teamMembersDetail: {
//     fontSize: scaleSize(15), // Applied scaleSize
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   menuButton: {
//     color: 'white',
//     fontSize: scaleSize(28), // Applied scaleSize
//     padding: scaleSize(16), // Applied scaleSize
//   },
//   icon: {
//     marginLeft: scaleSize(15), // Applied scaleSize
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: scaleSize(1), // Applied scaleSize
//     fontSize: scaleSize(24), // Applied scaleSize
//   },
//   lottieAnimation: {
//     width: scaleSize(350), // Applied scaleSize
//     height: scaleSize(350), // Applied scaleSize
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: scaleSize(22), // Applied scaleSize
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: scaleSize(40), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//   },
//   modalTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   modalText: {
//     color: 'white',
//     fontSize: scaleSize(26), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   deleteButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   cancelButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   input: {
//     height: scaleSize(40), // Applied scaleSize
//     borderColor: '#ccc',
//     borderWidth: scaleSize(1.4), // Applied scaleSize
//     borderRadius: scaleSize(20), // Applied scaleSize
//     marginBottom: scaleSize(12), // Applied scaleSize
//     paddingHorizontal: scaleSize(8), // Applied scaleSize
//     width: scaleSize(200), // Applied scaleSize
//     color: 'white',
//   },
//   image: {
//     width: scaleSize(150), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//     height: scaleSize(150), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePickerModal: {
//     width: '80%',
//     backgroundColor: 'rgba(172, 188, 198, 1.1)',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//   },
//   imagePickerTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   imagePickerSubtitle: {
//     fontSize: scaleSize(16), // Applied scaleSize
//     color: 'white',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   imagePickerOptions: {
//     width: '100%',
//   },
//   imagePickerOptionText: {
//     fontSize: scaleSize(21), // Applied scaleSize
//     color: 'white',
//     padding: scaleSize(8), // Applied scaleSize
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;




//******************************************************************************************************************** */




// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, 
//   Alert, ActivityIndicator, SafeAreaView, Dimensions 
// } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import LottieView from 'lottie-react-native';
// import NotificationBadge from '../components/NotificationBadge';
// import ButtonTools from '../components/ButtonTools';
// import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary
// // Add scaleSize function
// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const guidelineBaseWidth = 375;

// const scaleSize = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [teamToDelete, setTeamToDelete] = useState(null);
//   const [loadingTeams, setLoadingTeams] = useState(true);
//   const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   const buttons = useMemo(() => [
//     {
//       iconName: 'account-cog',
//       label: '  Account ',
//       onPress: () => navigation.navigate('UserSettingsScreen'),
//     },
//     {
//       iconName: 'account-multiple-plus',
//       label: 'Create Team',
//       onPress: () => {
//         setModalType('create');
//         setModalVisible(true);
//       }
//     },
//     {
//       iconName: 'location-enter',
//       label: 'Join Team',
//       onPress: () => {
//         setModalType('join');
//         setModalVisible(true);
//       }
//     },
//   ], [navigation]);

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
//       } finally {
//         setTimeout(() => setLoadingTeams(false), 100);
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

//   const refreshTeams = useCallback(async () => {
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
//   }, [firestore, user.uid]);

//   const selectImage = useCallback(async (source) => {
//     setImagePickerModalVisible(false);
//     let result;

//     if (source === 'camera') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     }

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   }, []);
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
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       const teamDoc = await getDoc(teamRef);

//       const currentImageUrl = teamDoc.data().imageUrl;

//       const imageUrl = await uploadImage(imageUri);

//       if (currentImageUrl) {
//         const oldImageRef = ref(storage, currentImageUrl);
//         await deleteObject(oldImageRef);
//       }

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

//   const confirmDeleteTeam = (teamId) => {
//     setTeamToDelete(teamId);
//     setIsDeleteModalVisible(true);
//   };

//   const handleDeleteTeam = async () => {
//     setIsDeleteModalVisible(false);
//     const teamId = teamToDelete;
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
//         const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
//         for (const categoryDoc of categoriesQuerySnapshot.docs) {
//           const categoryData = categoryDoc.data();
//           if (categoryData.teamId === teamId) {
//             const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
//             for (const itemDoc of itemsQuerySnapshot.docs) {
//               await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
//               const itemData = itemDoc.data();
//               if (itemData.img) {
//                 const imgRef = ref(storage, itemData.img);
//                 await deleteObject(imgRef);
//               }
//             }
//             if (categoryData.img) {
//               const categoryImgRef = ref(storage, categoryData.img);
//               await deleteObject(categoryImgRef);
//             }
//             await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
//           }
//         }
      
//         if (teamData.imageUrl) {
//           const teamImgRef = ref(storage, teamData.imageUrl);
//           await deleteObject(teamImgRef);
//         }
//         await deleteDoc(teamRef);
      
//         Alert.alert('Team deleted successfully!');
//         refreshTeams();
//       } else {
//         Alert.alert('Error', 'Team not found.');
//       }
//       } catch (error) {
//         console.error('Error deleting team: ', error);
//         Alert.alert('Error', 'Failed to delete team.');
//       }
//       };
      
//       const handleLeaveTeam = async (teamId) => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
//           await updateDoc(userDocRef, { teams: updatedTeams });
//         }
      
//         const teamRef = doc(firestore, 'teams', teamId);
//         const teamDoc = await getDoc(teamRef);
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
//           const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
//           await updateDoc(teamRef, { members: updatedMembers });
//         }
      
//         Alert.alert('You have left the team.');
//         refreshTeams();
//       } catch (error) {
//         console.error('Error leaving team: ', error);
//         Alert.alert('Error', 'Failed to leave team.');
//       }
//       };
      
//       const renderTeamItem = useCallback(({ item }) => {
//       const isOwner = item.owner.uid === user.uid;
      
//       return (
//         <View style={styles.teamItemContainer}>
//           <Text style={styles.teamDetail}></Text>
//           <TouchableOpacity
//             style={styles.teamItem}
//             onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//           >
//             <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//             <View style={styles.teamInfo}>
//               <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
//               <View style={styles.nameContainer}>
//                 <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
//               </View>
//               <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
//             </View>
//           </TouchableOpacity>
//           <Menu>
//             <MenuTrigger>
//               <MaterialCommunityIcons 
//                 style={styles.menuButton} 
//                 name="cog" size={24} color="white" 
//               />
//             </MenuTrigger>
//             <MenuOptions
//               customStyles={{
//                 optionsContainer: {
//                   backgroundColor: '#9cacbc',
//                   paddingVertical: 10,
//                   borderRadius: 20,
//                   paddingHorizontal: 15,
//                   backgroundColor: 'rgba(172, 188, 198, 1.7)',
//                   fontSize: 28,
//                   color: 'white',
//                 },
//               }}
//             >
//               {isOwner ? (
//                 <>
//                   <MenuOption
//                     onSelect={() => {
//                       setEditTeam(item);
//                       setTeamName(item.name);
//                       setImageUri(item.imageUrl);
//                       setModalType('edit');
//                       setModalVisible(true);
//                     }}
//                     text="Edit"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => confirmDeleteTeam(item.id)}
//                     text="Delete"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                     text="Manage"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <MenuOption
//                     onSelect={() => handleLeaveTeam(item.id)}
//                     text="Leave Team"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                     text="Manage"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                 </>
//               )}
//             </MenuOptions>
//           </Menu>
//         </View>
//       );
//       }, [navigation, user.uid, confirmDeleteTeam, handleLeaveTeam]);
      
//       return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.listContainer}>
//           {loadingTeams ? (
//             <View style={styles.loadingContainer}>
//               <LottieView
//                 source={require('../../assets/loading4.json')} 
//                 autoPlay
//                 loop
//                 style={styles.lottieAnimation}
//               />
//             </View>
//           ) : (
//             <>
//               {teams.length === 0 ? (
//                 <View style={styles.noTeamsContainer}>
//                   <Text style={styles.noTeamsText}>
//                     You are not currently a member of any teams. Please join an existing team or create your own!
//                   </Text>
//                   <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
//                 </View>
//               ) : (
//                 <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
//               )}
//             </>
//           )}
//         </View>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           {modalType === 'create' ? (
//             <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//           ) : modalType === 'join' ? (
//             <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//           ) : (
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <Text style={styles.modalTitle}>Edit Team</Text>
//                 <TextInput
//                   placeholder="Team Name"
//                   value={teamName}
//                   onChangeText={setTeamName}
//                   placeholderTextColor={"white"}
//                   style={styles.input}
//                 />
//                 <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
//                   <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
//                 </TouchableOpacity>
//                 {loading ? (
//                   <ActivityIndicator size="large" color="white" />
//                 ) : (
//                   <>
//                     <View style={styles.buttonRow}>
//                       <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
//                         <Text style={styles.buttonText}>Update</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(false)}>
//                         <Text style={styles.buttonText}>Cancel</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </View>
//             </View>
//           )}
//         </Modal>
      
//         <Modal
//           transparent={true}
//           visible={imagePickerModalVisible}
//           animationType="slide"
//           onRequestClose={() => setImagePickerModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.imagePickerModal}>
//               <Text style={styles.imagePickerTitle}>Select Image</Text>
//               <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
//               <View style={styles.imagePickerOptions}>
//                 <TouchableOpacity onPress={() => selectImage('camera')}>
//                   <Text style={styles.imagePickerOptionText}>Camera</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => selectImage('library')}>
//                   <Text style={styles.imagePickerOptionText}>Library</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
//                   <Text style={styles.imagePickerOptionText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//         <Modal
//     animationType="slide"
//     transparent={true}
//     visible={isDeleteModalVisible}
//     onRequestClose={() => setIsDeleteModalVisible(false)}
//   >
//     <View style={styles.modalContainer}>
//       <View style={styles.modalView}>
//         <Text style={styles.modalTitle}>Warning</Text>
//         <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
//             <Text style={styles.buttonText}>Delete</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsDeleteModalVisible(false)}>
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>

//   <ButtonTools buttons={buttons} />
// </SafeAreaView>
// );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     alignItems: 'center',
//     padding: scaleSize(6), // Applied scaleSize
//     backgroundColor: '#9cacbc',
//     backgroundColor: 'rgba(172, 188, 198, 0.7)',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: scaleSize(20), // Applied scaleSize
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     padding: scaleSize(16), // Applied scaleSize
//     backgroundColor: 'gray',
//   },
//   badge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: 'red',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     width: scaleSize(20), // Applied scaleSize
//     height: scaleSize(20), // Applied scaleSize
//     justifyContent: 'center', // Changed from 'right' to 'center' for correct Flexbox alignment
//     alignItems: 'center',
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   button: {
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     padding: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(5), // Applied scaleSize
//     justifyContent: 'space-between',
//     marginVertical: scaleSize(2), // Applied scaleSize
//   },
//   primaryButton: {
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: scaleSize(19), // Applied scaleSize
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     fontWeight: 'bold',
//     marginVertical: scaleSize(8), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center',
//     padding: scaleSize(5), // Applied scaleSize
//     marginVertical: scaleSize(7), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 0.33)',
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noTeamsImage: {
//     width: scaleSize(300), // Applied scaleSize
//     height: scaleSize(460), // Applied scaleSize
//     marginBottom: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsText: {
//     fontSize: scaleSize(25), // Applied scaleSize
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: scaleSize(30), // Applied scaleSize
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
//     width: scaleSize(130), // Applied scaleSize
//     height: scaleSize(130), // Applied scaleSize
//     borderRadius: scaleSize(25), // Applied scaleSize
//   },
//   teamInfo: {
//     marginLeft: scaleSize(16), // Applied scaleSize
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: scaleSize(22), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamDetail: {
//     fontSize: scaleSize(18), // Applied scaleSize
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   teamMembersDetail: {
//     fontSize: scaleSize(15), // Applied scaleSize
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   menuButton: {
//     color: 'white',
//     fontSize: scaleSize(28), // Applied scaleSize
//     padding: scaleSize(16), // Applied scaleSize
//   },
//   icon: {
//     marginLeft: scaleSize(15), // Applied scaleSize
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: scaleSize(1), // Applied scaleSize
//     fontSize: scaleSize(24), // Applied scaleSize
//   },
//   lottieAnimation: {
//     width: scaleSize(350), // Applied scaleSize
//     height: scaleSize(350), // Applied scaleSize
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: scaleSize(22), // Applied scaleSize
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: scaleSize(40), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//   },
//   modalTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   modalText: {
//     color: 'white',
//     fontSize: scaleSize(26), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   deleteButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   cancelButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   input: {
//     height: scaleSize(40), // Applied scaleSize
//     borderColor: '#ccc',
//     borderWidth: scaleSize(1.4), // Applied scaleSize
//     borderRadius: scaleSize(20), // Applied scaleSize
//     marginBottom: scaleSize(12), // Applied scaleSize
//     paddingHorizontal: scaleSize(8), // Applied scaleSize
//     width: scaleSize(200), // Applied scaleSize
//     color: 'white',
//   },
//   image: {
//     width: scaleSize(150), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//     height: scaleSize(150), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePickerModal: {
//     width: '80%',
//     backgroundColor: 'rgba(172, 188, 198, 1.1)',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//   },
//   imagePickerTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   imagePickerSubtitle: {
//     fontSize: scaleSize(16), // Applied scaleSize
//     color: 'white',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   imagePickerOptions: {
//     width: '100%',
//   },
//   imagePickerOptionText: {
//     fontSize: scaleSize(21), // Applied scaleSize
//     color: 'white',
//     padding: scaleSize(8), // Applied scaleSize
//     textAlign: 'center',
//   },
// });

// export default React.memo(HomeScreen);

      






//******************************************************************************************************************** */



// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, 
//   Alert, ActivityIndicator, SafeAreaView, Dimensions 
// } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import LottieView from 'lottie-react-native';
// import NotificationBadge from '../components/NotificationBadge';
// import ButtonTools from '../components/ButtonTools';
// import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary
// // Add scaleSize function
// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const guidelineBaseWidth = 375;

// const scaleSize = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [teamToDelete, setTeamToDelete] = useState(null);
//   const [loadingTeams, setLoadingTeams] = useState(true);
//   const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   const buttons = useMemo(() => [
//     {
//       iconName: 'account-cog',
//       label: '  Account ',
//       onPress: () => navigation.navigate('UserSettingsScreen'),
//     },
//     {
//       iconName: 'account-multiple-plus',
//       label: 'Create Team',
//       onPress: () => {
//         setModalType('create');
//         setModalVisible(true);
//       }
//     },
//     {
//       iconName: 'location-enter',
//       label: 'Join Team',
//       onPress: () => {
//         setModalType('join');
//         setModalVisible(true);
//       }
//     },
//   ], [navigation]);

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
//       } finally {
//         setTimeout(() => setLoadingTeams(false), 100);
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

//   const refreshTeams = useCallback(async () => {
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
//   }, [firestore, user.uid]);

//   const selectImage = useCallback(async (source) => {
//     setImagePickerModalVisible(false);
//     let result;

//     if (source === 'camera') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     }

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   }, []);
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
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       const teamDoc = await getDoc(teamRef);

//       const currentImageUrl = teamDoc.data().imageUrl;

//       const imageUrl = await uploadImage(imageUri);

//       if (currentImageUrl) {
//         const oldImageRef = ref(storage, currentImageUrl);
//         await deleteObject(oldImageRef);
//       }

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
//       } catch (error) {
//         console.error('Error updating team: ', error);
//         Alert.alert('Error', 'Failed to update team.');
//       } finally {
//         setLoading(false);
//       }
//       };
      
//       const confirmDeleteTeam = (teamId) => {
//       setTeamToDelete(teamId);
//       setIsDeleteModalVisible(true);
//       };
      
//       const handleDeleteTeam = async () => {
//       setIsDeleteModalVisible(false);
//       const teamId = teamToDelete;
//       try {
//         const teamRef = doc(firestore, 'teams', teamId);
//         const teamDoc = await getDoc(teamRef);
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
      
//           for (const member of teamData.members) {
//             const memberRef = doc(firestore, 'users', member.uid);
//             const memberDoc = await getDoc(memberRef);
//             if (memberDoc.exists()) {
//               const memberData = memberDoc.data();
//               const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
//               await updateDoc(memberRef, { teams: updatedTeams });
//             }
//           }
      
//           const categoriesQuerySnapshot = await getDocs(collection(firestore, 'categories'));
//           for (const categoryDoc of categoriesQuerySnapshot.docs) {
//             const categoryData = categoryDoc.data();
//             if (categoryData.teamId === teamId) {
//               const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
//               for (const itemDoc of itemsQuerySnapshot.docs) {
//                 await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
//                 const itemData = itemDoc.data();
//                 if (itemData.img) {
//                   const imgRef = ref(storage, itemData.img);
//                   await deleteObject(imgRef);
//                 }
//               }
//               if (categoryData.img) {
//                 const categoryImgRef = ref(storage, categoryData.img);
//                 await deleteObject(categoryImgRef);
//               }
//               await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
//             }
//           }
      
//           if (teamData.imageUrl) {
//             const teamImgRef = ref(storage, teamData.imageUrl);
//             await deleteObject(teamImgRef);
//           }
//           await deleteDoc(teamRef);
      
//           Alert.alert('Team deleted successfully!');
//           refreshTeams();
//         } else {
//           Alert.alert('Error', 'Team not found.');
//         }
//       } catch (error) {
//         console.error('Error deleting team: ', error);
//         Alert.alert('Error', 'Failed to delete team.');
//       }
//       };
      
//       const handleLeaveTeam = async (teamId) => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
//           await updateDoc(userDocRef, { teams: updatedTeams });
//         }
      
//         const teamRef = doc(firestore, 'teams', teamId);
//         const teamDoc = await getDoc(teamRef);
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
//           const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
//           await updateDoc(teamRef, { members: updatedMembers });
//         }
      
//         Alert.alert('You have left the team.');
//         refreshTeams();
//       } catch (error) {
//         console.error('Error leaving team: ', error);
//         Alert.alert('Error', 'Failed to leave team.');
//       }
//       };
      
//       const renderTeamItem = useCallback(({ item }) => {
//       const isOwner = item.owner.uid === user.uid;
      
//       return (
//         <View style={styles.teamItemContainer}>
//           <Text style={styles.teamDetail}></Text>
//           <TouchableOpacity
//             style={styles.teamItem}
//             onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//           >
//             <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//             <View style={styles.teamInfo}>
//               <Text style={styles.teamName}>{item.name.toUpperCase()}</Text>
//               <View style={styles.nameContainer}>
//                 <Text style={styles.teamDetail}>By {item.owner.name.toUpperCase()}</Text>
//               </View>
//               <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
//             </View>
//           </TouchableOpacity>
//           <Menu>
//             <MenuTrigger>
//               <MaterialCommunityIcons 
//                 style={styles.menuButton} 
//                 name="cog" size={24} color="white" 
//               />
//             </MenuTrigger>
//             <MenuOptions
//               customStyles={{
//                 optionsContainer: {
//                   backgroundColor: '#9cacbc',
//                   paddingVertical: 10,
//                   borderRadius: 20,
//                   paddingHorizontal: 15,
//                   backgroundColor: 'rgba(172, 188, 198, 1.7)',
//                   fontSize: 28,
//                   color: 'white',
//                 },
//               }}
//             >
//               {isOwner ? (
//                 <>
//                   <MenuOption
//                     onSelect={() => {
//                       setEditTeam(item);
//                       setTeamName(item.name);
//                       setImageUri(item.imageUrl);
//                       setModalType('edit');
//                       setModalVisible(true);
//                     }}
//                     text="Edit"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => confirmDeleteTeam(item.id)}
//                     text="Delete"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                     text="Manage"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <MenuOption
//                     onSelect={() => handleLeaveTeam(item.id)}
//                     text="Leave Team"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                   <MenuOption
//                     onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                     text="Manage"
//                     customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                   />
//                 </>
//               )}
//             </MenuOptions>
//           </Menu>
//         </View>
//       );
//       }, [navigation, user.uid, confirmDeleteTeam, handleLeaveTeam]);
      
//       return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.listContainer}>
//           {loadingTeams ? (
//             <View style={styles.loadingContainer}>
//               <LottieView
//                 source={require('../../assets/loading4.json')} 
//                 autoPlay
//                 loop
//                 style={styles.lottieAnimation}
//               />
//             </View>
//           ) : (
//             <>
//               {teams.length === 0 ? (
//                 <View style={styles.noTeamsContainer}>
//                   <Text style={styles.noTeamsText}>
//                     You are not currently a member of any teams. Please join an existing team or create your own!
//                   </Text>
//                   <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
//                 </View>
//               ) : (
//                 <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
//               )}
//             </>
//           )}
//         </View>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           {modalType === 'create' ? (
//             <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//           ) : modalType === 'join' ? (
//             <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//           ) : (
//             <View style={styles.centeredView}>
//               <View style={styles.modalView}>
//                 <Text style={styles.modalTitle}>Edit Team</Text>
//                 <TextInput
//                   placeholder="Team Name"
//                   value={teamName}
//                   onChangeText={setTeamName}
//                   placeholderTextColor={"white"}
//                   style={styles.input}
//                 />
//                 <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
//                   <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
//                 </TouchableOpacity>
//                 {loading ? (
//                   <ActivityIndicator size="large" color="white" />
//                 ) : (
//                   <>
//                     <View style={styles.buttonRow}>
//                       <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
//                         <Text style={styles.buttonText}>Update</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(false)}>
//                         <Text style={styles.buttonText}>Cancel</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </View>
//             </View>
//           )}
//         </Modal>
      
//         <Modal
//   transparent={true}
//   visible={imagePickerModalVisible}
//   animationType="slide"
//   onRequestClose={() => setImagePickerModalVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.imagePickerModal}>
//       <Text style={styles.imagePickerTitle}>Select Image</Text>
//       <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
//       <View style={styles.imagePickerOptions}>
//         <TouchableOpacity onPress={() => selectImage('camera')}>
//           <Text style={styles.imagePickerOptionText}>Camera</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => selectImage('library')}>
//           <Text style={styles.imagePickerOptionText}>Library</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
//           <Text style={styles.imagePickerOptionText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

// <Modal
//   animationType="slide"
//   transparent={true}
//   visible={isDeleteModalVisible}
//   onRequestClose={() => setIsDeleteModalVisible(false)}
// >
//   <View style={styles.modalContainer}>
//     <View style={styles.modalView}>
//       <Text style={styles.modalTitle}>Warning</Text>
//       <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
//           <Text style={styles.buttonText}>Delete</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsDeleteModalVisible(false)}>
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

// <ButtonTools buttons={buttons} />
// </SafeAreaView>
// );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     alignItems: 'center',
//     padding: scaleSize(6), // Applied scaleSize
//     backgroundColor: '#9cacbc',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: scaleSize(20), // Applied scaleSize
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end', // Changed from 'right' to 'flex-end' for correct Flexbox alignment
//     padding: scaleSize(16), // Applied scaleSize
//     backgroundColor: 'gray',
//   },
//   badge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: 'red',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     width: scaleSize(20), // Applied scaleSize
//     height: scaleSize(20), // Applied scaleSize
//     justifyContent: 'center', // Changed from 'right' to 'center' for correct Flexbox alignment
//     alignItems: 'center',
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   button: {
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     padding: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(5), // Applied scaleSize
//     justifyContent: 'space-between',
//     marginVertical: scaleSize(2), // Applied scaleSize
//   },
//   primaryButton: {
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: scaleSize(19), // Applied scaleSize
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: scaleSize(24), // Applied scaleSize
//     fontWeight: 'bold',
//     marginVertical: scaleSize(8), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center',
//     padding: scaleSize(5), // Applied scaleSize
//     marginVertical: scaleSize(7), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 0.33)',
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noTeamsImage: {
//     width: scaleSize(300), // Applied scaleSize
//     height: scaleSize(460), // Applied scaleSize
//     marginBottom: scaleSize(10), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//   },
//   noTeamsText: {
//     fontSize: scaleSize(25), // Applied scaleSize
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: scaleSize(30), // Applied scaleSize
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
//     width: scaleSize(130), // Applied scaleSize
//     height: scaleSize(130), // Applied scaleSize
//     borderRadius: scaleSize(25), // Applied scaleSize
//   },
//   teamInfo: {
//     marginLeft: scaleSize(16), // Applied scaleSize
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: scaleSize(22), // Applied scaleSize
//     color: '#f0f0f0',
//   },
//   teamDetail: {
//     fontSize: scaleSize(18), // Applied scaleSize
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   teamMembersDetail: {
//     fontSize: scaleSize(15), // Applied scaleSize
//     color: '#f0f0f0',
//     marginTop: scaleSize(6), // Applied scaleSize
//   },
//   menuButton: {
//     color: 'white',
//     fontSize: scaleSize(28), // Applied scaleSize
//     padding: scaleSize(16), // Applied scaleSize
//   },
//   icon: {
//     marginLeft: scaleSize(15), // Applied scaleSize
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: scaleSize(1), // Applied scaleSize
//     fontSize: scaleSize(24), // Applied scaleSize
//   },
//   lottieAnimation: {
//     width: scaleSize(350), // Applied scaleSize
//     height: scaleSize(350), // Applied scaleSize
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: scaleSize(22), // Applied scaleSize
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: scaleSize(40), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//   },
//   modalTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   modalText: {
//     color: 'white',
//     fontSize: scaleSize(26), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   deleteButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   cancelButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10), // Applied scaleSize
//     marginHorizontal: scaleSize(5), // Applied scaleSize
//     paddingHorizontal: scaleSize(20), // Applied scaleSize
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90), // Applied scaleSize
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   input: {
//     height: scaleSize(40), // Applied scaleSize
//     borderColor: '#ccc',
//     borderWidth: scaleSize(1.4), // Applied scaleSize
//     borderRadius: scaleSize(20), // Applied scaleSize
//     marginBottom: scaleSize(12), // Applied scaleSize
//     paddingHorizontal: scaleSize(8), // Applied scaleSize
//     width: scaleSize(200), // Applied scaleSize
//     color: 'white',
//   },
//   image: {
//     width: scaleSize(150), // Applied scaleSize
//     borderRadius: scaleSize(30), // Applied scaleSize
//     height: scaleSize(150), // Applied scaleSize
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePickerModal: {
//     width: '80%',
//     backgroundColor: 'rgba(172, 188, 198, 1.1)',
//     borderRadius: scaleSize(10), // Applied scaleSize
//     padding: scaleSize(20), // Applied scaleSize
//     alignItems: 'center',
//   },
//   imagePickerTitle: {
//     fontSize: scaleSize(20), // Applied scaleSize
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10), // Applied scaleSize
//   },
//   imagePickerSubtitle: {
//     fontSize: scaleSize(16), // Applied scaleSize
//     color: 'white',
//     marginBottom: scaleSize(20), // Applied scaleSize
//   },
//   imagePickerOptions: {
//     width: '100%',
//   },
//   imagePickerOptionText: {
//     fontSize: scaleSize(21), // Applied scaleSize
//     color: 'white',
//     padding: scaleSize(8), // Applied scaleSize
//     textAlign: 'center',
//   },
// });

// export default React.memo(HomeScreen);




//**keep this part !! */


// import React, { useEffect, useState, useCallback, useMemo, useRef,useContext } from 'react';
// import {BackHandler , View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation,useFocusEffect  } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import * as ImagePicker from 'expo-image-picker';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import LottieView from 'lottie-react-native';
// import NotificationBadge from '../components/NotificationBadge';
// import ButtonTools from '../components/ButtonTools';
// import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary
// import { NotificationContext,fetchNotifications } from '../components/NotificationProvider';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const guidelineBaseWidth = 375;

// const scaleSize = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// const HomeScreen = ({ navigation }) => {




//   useFocusEffect(
//     React.useCallback(() => {
//       const backAction = () => {
//         Alert.alert(
//           "Hold on!",
//           "Are you sure you want to log out?",
//           [
//             {
//               text: "Cancel",
//               onPress: () => null,
//               style: "cancel"
//             },
//             { text: "YES", onPress: () => navigation.navigate('Login') }
//           ]
//         );
//         return true;
//       };

//       const backHandler = BackHandler.addEventListener(
//         "hardwareBackPress",
//         backAction
//       );

//       return () => backHandler.remove();
//     }, [navigation])
//   );



















//   const [teams, setTeams] = useState([]);
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [joinModalVisible, setJoinModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editTeam, setEditTeam] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [teamName, setTeamName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [teamToDelete, setTeamToDelete] = useState(null);
//   const [loadingTeams, setLoadingTeams] = useState(true);
//   const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
//   const TextInputRef = useRef(null);
//   const selectImage = useCallback(async (source) => {
//     setImagePickerModalVisible(false);
//     let result;

//     if (source === 'camera') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//     }

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   }, []);
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;
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
//   const buttons = useMemo(() => [
//     {
//       iconName: 'account-cog',
//       label: '  Account ',
//       onPress: () => navigation.navigate('UserSettingsScreen'),
//     },
//     {
//       iconName: 'account-multiple-plus',
//       label: 'Create Team',
//       onPress: () => {
//         setCreateModalVisible(true);
//       }
//     },
//     {
//       iconName: 'location-enter',
//       label: 'Join Team',
//       onPress: () => {
//         setJoinModalVisible(true);
//       }
//     },
//   ], [navigation]);

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const teamsArray = userData.teams || [];

//           const validTeams = [];

//           // Batch read team data
//           const teamIds = teamsArray.map(team => team.teamId);
//           const teamsQuery = query(collection(firestore, 'teams'), where('__name__', 'in', teamIds));
//           const teamsSnapshot = await getDocs(teamsQuery);

//           teamsSnapshot.forEach((teamDoc) => {
//             if (teamDoc.exists()) {
//               validTeams.push({ id: teamDoc.id, ...teamDoc.data() });
//             }
//           });

//           // Remove invalid teams
//           const validTeamIds = validTeams.map(team => team.id);
//           const invalidTeams = teamsArray.filter(team => !validTeamIds.includes(team.teamId));
//           if (invalidTeams.length > 0) {
//             await updateDoc(userDocRef, {
//               teams: arrayRemove(...invalidTeams)
//             });
//           }

//           setTeams(validTeams);
//         }
//       } catch (error) {
//         console.error('Error fetching teams: ', error);
//       } finally {
//         setTimeout(() => setLoadingTeams(false), 4000);
//       }
//     };

//     fetchTeams();
//   }, [user]);

//   useEffect(() => {
//     if (createModalVisible) {
//       const timer = setTimeout(() => {
//         TextInputRef.current?.focus();
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [createModalVisible]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const refreshTeams = useCallback(async () => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const teamsArray = userData.teams || [];

//         const validTeams = [];

//         // Batch read team data
//         const teamIds = teamsArray.map(team => team.teamId);
//         const teamsQuery = query(collection(firestore, 'teams'), where('__name__', 'in', teamIds));
//         const teamsSnapshot = await getDocs(teamsQuery);

//         teamsSnapshot.forEach((teamDoc) => {
//           if (teamDoc.exists()) {
//             validTeams.push({ id: teamDoc.id, ...teamDoc.data() });
//           }
//         });

//         // Remove invalid teams
//         const validTeamIds = validTeams.map(team => team.id);
//         const invalidTeams = teamsArray.filter(team => !validTeamIds.includes(team.teamId));
//         if (invalidTeams.length > 0) {
//           await updateDoc(userDocRef, {
//             teams: arrayRemove(...invalidTeams)
//           });
//         }

//         setTeams(validTeams);
//       }
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   }, [firestore, user.uid]);

//   const handleEditTeam = async () => {
//     if (!teamName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a team name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const teamRef = doc(firestore, 'teams', editTeam.id);
//       const teamDoc = await getDoc(teamRef);

//       const currentImageUrl = teamDoc.data().imageUrl;

//       const imageUrl = await uploadImage(imageUri);

//       if (currentImageUrl) {
//         const oldImageRef = ref(storage, currentImageUrl);
//         await deleteObject(oldImageRef);
//       }

//       await updateDoc(teamRef, {
//         name: teamName,
//         imageUrl: imageUrl,
//       });

//       Alert.alert('Team updated successfully!');
//       setEditTeam(null);
//       setTeamName('');
//       setImageUri('');
//       setEditModalVisible(false);
//       refreshTeams();
//     } catch (error) {
//       console.error('Error updating team: ', error);
//       Alert.alert('Error', 'Failed to update team.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDeleteTeam = (teamId) => {
//     setTeamToDelete(teamId);
//     setIsDeleteModalVisible(true);
//   };

//   const handleDeleteTeam = async () => {
//     setIsDeleteModalVisible(false);
//     const teamId = teamToDelete;
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

//         // Batch delete team categories and items
//         const categoriesQuerySnapshot = await getDocs(query(collection(firestore, 'categories'), where('teamId', '==', teamId)));
//         for (const categoryDoc of categoriesQuerySnapshot.docs) {
//           const categoryData = categoryDoc.data();
//           const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
//           for (const itemDoc of itemsQuerySnapshot.docs) {
//             await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
//             const itemData = itemDoc.data();
//             if (itemData.img) {
//               const imgRef = ref(storage, itemData.img);
//               await deleteObject(imgRef);
//             }
//           }
//           if (categoryData.img) {
//             const categoryImgRef = ref(storage, categoryData.img);
//             await deleteObject(categoryImgRef);
//           }
//           await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
//         }

//         if (teamData.imageUrl) {
//           const teamImgRef = ref(storage, teamData.imageUrl);
//           await deleteObject(teamImgRef);
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

//   const handleLeaveTeam = async (teamId) => {
//     try {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
//         await updateDoc(userDocRef, { teams: updatedTeams });
//       }

//       const teamRef = doc(firestore, 'teams', teamId);
//       const teamDoc = await getDoc(teamRef);
//       if (teamDoc.exists()) {
//         const teamData = teamDoc.data();
//         const updatedMembers = teamData.members.filter(member => member.uid !== user.uid);
//         await updateDoc(teamRef, { members: updatedMembers });
//       }

//       Alert.alert('You have left the team.');
//       refreshTeams();
//     } catch (error) {
//       console.error('Error leaving team: ', error);
//       Alert.alert('Error', 'Failed to leave team.');
//     }
//   };

//   const renderTeamItem = useCallback(({ item }) => {
//     const isOwner = item.owner.uid === user.uid;

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
//               <Text style={styles.teamMembersDetail}>By {item.owner.name.toUpperCase()}</Text>
//             </View>
//             <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
//           </View>
//         </TouchableOpacity>
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons 
//               style={styles.menuButton} 
//               name="cog" size={24} color="white" 
//             />
//           </MenuTrigger>
//           <MenuOptions
//             customStyles={{
//               optionsContainer: {
//                 backgroundColor: '#9cacbc',
//                 paddingVertical: 10,
//                 borderRadius: 20,
//                 paddingHorizontal: 15,
//                 backgroundColor: 'black',
//                 fontSize: 28,
//                 color: 'white',
//               },
//             }}
//           >
//             {isOwner ? (
//               <>
//                 <MenuOption
//                   onSelect={() => {
//                     setEditTeam(item);
//                     setTeamName(item.name);
//                     setImageUri(item.imageUrl);
//                     setEditModalVisible(true);
//                   }}
//                   text="Edit"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => confirmDeleteTeam(item.id)}
//                   text="Delete"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             ) : (
//               <>
//                 <MenuOption
//                   onSelect={() => handleLeaveTeam(item.id)}
//                   text="Leave Team"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//                 <MenuOption
//                   onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
//                   text="Manage"
//                   customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
//                 />
//               </>
//             )}
//           </MenuOptions>
//         </Menu>
//       </View>
//     );
//   }, [navigation, user.uid, confirmDeleteTeam, handleLeaveTeam]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.listContainer}>
//         {loadingTeams ? (
//           <View style={styles.loadingContainer}>
//             <LottieView
//               source={require('../../assets/loading7.json')} 
//               autoPlay
//               loop
//               style={styles.lottieAnimation}
//             />
//           </View>
//         ) : (
//           <>




// <Text style={styles.categoryName}>MY TEAMS</Text>


//             {teams.length === 0 ? (
//               <View style={styles.noTeamsContainer}>
//                 <Text style={styles.noTeamsText}>
//                   You are not currently a member of any teams. Please join an existing team or create your own!
//                 </Text>
//                 <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
//               </View>
//             ) : (
//               <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
//             )}
//           </>
//         )
        
//         }
//       </View>
  
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={createModalVisible}
//         onRequestClose={() => setCreateModalVisible(false)}
//       >
//         <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} TextInputRef={TextInputRef} />
//       </Modal>
       
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={joinModalVisible}
//         onRequestClose={() => setJoinModalVisible(false)}
//       >
//         <JoinTeamModal setVisible={setJoinModalVisible} refreshTeams={refreshTeams} />
//       </Modal> 
  
//        <Modal
//         animationType="slide"
//         transparent={true}
//         visible={editModalVisible}
//         onRequestClose={() => setEditModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Edit Team</Text>
//             <TextInput
//               placeholder=" Team Name"
//               value={teamName}
//               onChangeText={setTeamName}
//               placeholderTextColor={"gray"}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
//               <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="white" />
//             ) : (
//               <>
//                 <View style={styles.buttonRow}>
//                   <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
//                     <Text style={styles.buttonText}>Update</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setEditModalVisible(false)}>
//                     <Text style={styles.buttonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal> 

//       <Modal
//         transparent={true}
//         visible={imagePickerModalVisible}
//         animationType="slide"
//         onRequestClose={() => setImagePickerModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.imagePickerModal}>
//             <Text style={styles.imagePickerTitle}>Select Image</Text>
//             <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
//             <View style={styles.imagePickerOptions}>
//               <TouchableOpacity onPress={() => selectImage('camera')}>
//                 <Text style={styles.imagePickerOptionText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => selectImage('library')}>
//                 <Text style={styles.imagePickerOptionText}>Library</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
//                 <Text style={styles.imagePickerOptionText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isDeleteModalVisible}
//         onRequestClose={() => setIsDeleteModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Warning</Text>
//             <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
//                 <Text style={styles.buttonText}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setIsDeleteModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
      
//       {/* <View style={styles.container}>
//   <Button title="Open Create Team Modal" onPress={() => setCreateModalVisible(true)} />
//   {createModalVisible && (
//     <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} />
//   )}
// </View> */}


//   {createModalVisible && (
//     <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} />
//   )}


      

//       <ButtonTools buttons={buttons} />
     
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     padding: scaleSize(6),
//     backgroundColor: 'black',
//   },
//   categoryName: {
//     fontSize: scaleSize(25),
//     fontWeight: 'bold',   marginTop: scaleSize(0),
//     color: 'white',
//     textAlign: 'center', // Center the text
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: scaleSize(20),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: scaleSize(16),
//     backgroundColor: 'gray',
//   },
//   badge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: 'red',
//     borderRadius: scaleSize(10),
//     width: scaleSize(20),
//     height: scaleSize(20),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: scaleSize(24),
//     marginBottom: scaleSize(20),
//   },
//   button: {
//     elevation: 5,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     padding: scaleSize(10),
//     borderRadius: scaleSize(5),
//     justifyContent: 'space-between',
//     marginVertical: scaleSize(2),
//   },
//   primaryButton: {
//     elevation: 5,
//     paddingVertical: scaleSize(10),
//     paddingHorizontal: scaleSize(20),
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(20),
//     marginHorizontal: scaleSize(5),
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: scaleSize(15),
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: scaleSize(24),
//     fontWeight: 'bold',
//     marginVertical: scaleSize(8),
//     color: '#f0f0f0',
//   },
//   teamItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center',
//     padding: scaleSize(1),
//     marginVertical: scaleSize(4),
//     backgroundColor: 'rgba(172, 188, 198, 0.20)',
//     borderRadius: scaleSize(30),
//   },
//   noTeamsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noTeamsImage: {
//     width: scaleSize(260),
//     height: scaleSize(460),
//     marginBottom: scaleSize(10),
//     borderRadius: scaleSize(30),
//   },
//   noTeamsText: {
//     fontSize: scaleSize(22),
//     color: 'white',
//     textAlign: 'center', paddingHorizontal: scaleSize(30),paddingVertical: scaleSize(10),
//     marginBottom: scaleSize(30), marginTop: scaleSize(30),
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
//     width: scaleSize(130),
//     height: scaleSize(130),
//     borderRadius: scaleSize(25),
//   },
//   teamInfo: {
//     marginLeft: scaleSize(16),
//     flex: 1,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: scaleSize(24),
//     color: '#f0f0f0',
//   },
//   teamDetail: {
//     fontSize: scaleSize(18),
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginTop: scaleSize(6),
//   },
//   teamMembersDetail: {
//     fontSize: scaleSize(15),
//     color: 'gray',
//     marginTop: scaleSize(4),
//   },
//   menuButton: {
//     color: 'white',
//     fontSize: scaleSize(28),
//     padding: scaleSize(16),
//   },
//   icon: {
//     marginLeft: scaleSize(15),
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',     backgroundColor: 'black',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: scaleSize(1),
//     fontSize: scaleSize(24),
//   },
//   lottieAnimation: {
//     width: scaleSize(350),
//     height: scaleSize(350),
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: scaleSize(22),
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: scaleSize(40),
//     padding: scaleSize(20),
//     alignItems: 'center',
//     shadowColor: 'white',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     backgroundColor: 'black',
//   },
//   modalTitle: {
//     fontSize: scaleSize(20),
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10),
//   },
//   modalText: {
//     color: 'white',
//     fontSize: scaleSize(26),
//     marginBottom: scaleSize(20),
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//   },
//   deleteButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10),
//     paddingHorizontal: scaleSize(10),
//     backgroundColor: 'rgba(172, 188, 198, 0.43)',
//     borderRadius: scaleSize(90),
//     alignItems: 'center',
//     marginHorizontal: scaleSize(5),
//     justifyContent: 'center',
//     marginBottom: scaleSize(10),
//   },
//   cancelButton: {
//     width: '45%',
//     elevation: 5,
//     paddingVertical: scaleSize(10),
//     marginHorizontal: scaleSize(5),
//     paddingHorizontal: scaleSize(10),
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: scaleSize(90),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: scaleSize(10),
//   },
//   input: {
//     height: scaleSize(40),
//     borderColor: '#ccc',
//     borderWidth: scaleSize(1.4),
//     borderRadius: scaleSize(20),
//     marginBottom: scaleSize(12),
//     paddingHorizontal: scaleSize(8),
//     width: scaleSize(200),
//     color: 'gray',
//   },
//   image: {
//     width: scaleSize(150),
//     borderRadius: scaleSize(30),
//     height: scaleSize(150),
//     marginBottom: scaleSize(20),
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePickerModal: {
//     width: '80%',
//     backgroundColor: 'black',
//     borderRadius: scaleSize(40),
//     padding: scaleSize(60),
//     alignItems: 'center',
//   },
//   imagePickerTitle: {
//     fontSize: scaleSize(20),
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: scaleSize(10),
//   },
//   imagePickerSubtitle: {
//     fontSize: scaleSize(16),
//     color: 'white',
//     marginBottom: scaleSize(20),
//   },
//   imagePickerOptions: {
//     width: '100%',
//   },
//   imagePickerOptionText: {
//     fontSize: scaleSize(19),
//     color: 'white',
//     padding: scaleSize(8),
//     textAlign: 'center',
//   },
// });

// export default React.memo(HomeScreen);
//**   till here  keep this part !! */








import React, { useEffect, useState, useCallback, useMemo, useRef,useContext } from 'react';
import {BackHandler , View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
import CreateTeamModal from '../components/CreateTeamModal';
import JoinTeamModal from '../components/JoinTeamModal';
import { useNavigation,useFocusEffect  } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import LottieView from 'lottie-react-native';
import NotificationBadge from '../components/NotificationBadge';
import ButtonTools from '../components/ButtonTools';
import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary
import { NotificationContext,fetchNotifications } from '../components/NotificationProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const guidelineBaseWidth = 375;

const scaleSize = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

const HomeScreen = ({ navigation }) => {
  const { fetchNotifications } = useContext(NotificationContext);
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        if (user) {
          console.log('HomeScreen is focused');
          console.log(`Fetching notifications for user: ${user.displayName}`);
          fetchNotifications(user); // Fetch notifications when Home screen is focused
        } else {
          console.log('No user is currently logged in');
        }
        isFirstFocus.current = false;
      }

      const backAction = () => {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to log out?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => navigation.navigate('Login') }
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation, fetchNotifications, user])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      isFirstFocus.current = true;
    });

    return unsubscribe;
  }, [navigation]);








  const [teams, setTeams] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const TextInputRef = useRef(null);
  const selectImage = useCallback(async (source) => {
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
  }, []);
 // const auth = FIREBASE_AUTH;
  const firestore = getFirestore();
  //const user = auth.currentUser;
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
  const buttons = useMemo(() => [
    {
      iconName: 'account-cog',
      label: '  Account ',
      onPress: () => navigation.navigate('UserSettingsScreen'),
    },
    {
      iconName: 'account-multiple-plus',
      label: 'Create Team',
      onPress: () => {
        setCreateModalVisible(true);
      }
    },
    {
      iconName: 'location-enter',
      label: 'Join Team',
      onPress: () => {
        setJoinModalVisible(true);
      }
    },
  ], [navigation]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const teamsArray = userData.teams || [];

          const validTeams = [];

          // Batch read team data
          const teamIds = teamsArray.map(team => team.teamId);
          const teamsQuery = query(collection(firestore, 'teams'), where('__name__', 'in', teamIds));
          const teamsSnapshot = await getDocs(teamsQuery);

          teamsSnapshot.forEach((teamDoc) => {
            if (teamDoc.exists()) {
              validTeams.push({ id: teamDoc.id, ...teamDoc.data() });
            }
          });

          // Remove invalid teams
          const validTeamIds = validTeams.map(team => team.id);
          const invalidTeams = teamsArray.filter(team => !validTeamIds.includes(team.teamId));
          if (invalidTeams.length > 0) {
            await updateDoc(userDocRef, {
              teams: arrayRemove(...invalidTeams)
            });
          }

          setTeams(validTeams);
        }
      } catch (error) {
        console.error('Error fetching teams: ', error);
      } finally {
        setTimeout(() => setLoadingTeams(false), 4000);
      }
    };

    fetchTeams();
  }, [user]);

  useEffect(() => {
    if (createModalVisible) {
      const timer = setTimeout(() => {
        TextInputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [createModalVisible]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshTeams = useCallback(async () => {
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const teamsArray = userData.teams || [];

        const validTeams = [];

        // Batch read team data
        const teamIds = teamsArray.map(team => team.teamId);
        const teamsQuery = query(collection(firestore, 'teams'), where('__name__', 'in', teamIds));
        const teamsSnapshot = await getDocs(teamsQuery);

        teamsSnapshot.forEach((teamDoc) => {
          if (teamDoc.exists()) {
            validTeams.push({ id: teamDoc.id, ...teamDoc.data() });
          }
        });

        // Remove invalid teams
        const validTeamIds = validTeams.map(team => team.id);
        const invalidTeams = teamsArray.filter(team => !validTeamIds.includes(team.teamId));
        if (invalidTeams.length > 0) {
          await updateDoc(userDocRef, {
            teams: arrayRemove(...invalidTeams)
          });
        }

        setTeams(validTeams);
      }
    } catch (error) {
      console.error('Error refreshing teams: ', error);
    }
  }, [firestore, user.uid]);

  const handleEditTeam = async () => {
    if (!teamName.trim() || !imageUri) {
      Alert.alert('Missing information', 'Please provide a team name and select an image.');
      return;
    }
    setLoading(true);
    try {
      const teamRef = doc(firestore, 'teams', editTeam.id);
      const teamDoc = await getDoc(teamRef);

      const currentImageUrl = teamDoc.data().imageUrl;

      const imageUrl = await uploadImage(imageUri);

      if (currentImageUrl) {
        const oldImageRef = ref(storage, currentImageUrl);
        await deleteObject(oldImageRef);
      }

      await updateDoc(teamRef, {
        name: teamName,
        imageUrl: imageUrl,
      });

      Alert.alert('Team updated successfully!');
      setEditTeam(null);
      setTeamName('');
      setImageUri('');
      setEditModalVisible(false);
      refreshTeams();
    } catch (error) {
      console.error('Error updating team: ', error);
      Alert.alert('Error', 'Failed to update team.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTeam = (teamId) => {
    setTeamToDelete(teamId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteTeam = async () => {
    setIsDeleteModalVisible(false);
    const teamId = teamToDelete;
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();

        for (const member of teamData.members) {
          const memberRef = doc(firestore, 'users', member.uid);
          const memberDoc = await getDoc(memberRef);
          if (memberDoc.exists()) {
            const memberData = memberDoc.data();
            const updatedTeams = memberData.teams.filter(team => team.teamId !== teamId);
            await updateDoc(memberRef, { teams: updatedTeams });
          }
        }

        // Batch delete team categories and items
        const categoriesQuerySnapshot = await getDocs(query(collection(firestore, 'categories'), where('teamId', '==', teamId)));
        for (const categoryDoc of categoriesQuerySnapshot.docs) {
          const categoryData = categoryDoc.data();
          const itemsQuerySnapshot = await getDocs(collection(firestore, 'categories', categoryDoc.id, 'items'));
          for (const itemDoc of itemsQuerySnapshot.docs) {
            await deleteDoc(doc(firestore, 'categories', categoryDoc.id, 'items', itemDoc.id));
            const itemData = itemDoc.data();
            if (itemData.img) {
              const imgRef = ref(storage, itemData.img);
              await deleteObject(imgRef);
            }
          }
          if (categoryData.img) {
            const categoryImgRef = ref(storage, categoryData.img);
            await deleteObject(categoryImgRef);
          }
          await deleteDoc(doc(firestore, 'categories', categoryDoc.id));
        }

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
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedTeams = userData.teams.filter(team => team.teamId !== teamId);
        await updateDoc(userDocRef, { teams: updatedTeams });
      }

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

  const renderTeamItem = useCallback(({ item }) => {
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
              <Text style={styles.teamMembersDetail}>By {item.owner.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.teamMembersDetail}>Members: {item.members.length}</Text>
          </View>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <MaterialCommunityIcons 
              style={styles.menuButton} 
              name="cog" size={24} color="white" 
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                backgroundColor: '#9cacbc',
                paddingVertical: 10,
                borderRadius: 20,
                paddingHorizontal: 15,
                backgroundColor: 'black',
                fontSize: 28,
                color: 'white',
              },
            }}
          >
            {isOwner ? (
              <>
                <MenuOption
                  onSelect={() => {
                    setEditTeam(item);
                    setTeamName(item.name);
                    setImageUri(item.imageUrl);
                    setEditModalVisible(true);
                  }}
                  text="Edit"
                  customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
                />
                <MenuOption
                  onSelect={() => confirmDeleteTeam(item.id)}
                  text="Delete"
                  customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
                />
                <MenuOption
                  onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
                  text="Manage"
                  customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
                />
              </>
            ) : (
              <>
                <MenuOption
                  onSelect={() => handleLeaveTeam(item.id)}
                  text="Leave Team"
                  customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
                />
                <MenuOption
                  onSelect={() => navigation.navigate('ManageTeam', { teamId: item.id, teamName: item.name })}
                  text="Manage"
                  customStyles={{ optionText: { color: 'white', fontSize: 22 } }}
                />
              </>
            )}
          </MenuOptions>
        </Menu>
      </View>
    );
  }, [navigation, user.uid, confirmDeleteTeam, handleLeaveTeam]);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.listContainer}>
      {loadingTeams ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../../assets/loading7.json')} 
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
      ) : (
        <>
          <Text style={styles.categoryName}>MY TEAMS</Text>
          {teams.length === 0 ? (
            <View style={styles.noTeamsContainer}>
              <Text style={styles.noTeamsText}>
                You are not currently a member of any teams. Please join an existing team or create your own!
              </Text>
              <Image source={require('../../assets/noteam.png')} style={styles.noTeamsImage} />
            </View>
          ) : (
            <FlatList data={teams} keyExtractor={(item) => item.id} renderItem={renderTeamItem} />
          )}
        </>
      )}
    </View>

    <Modal
      animationType="slide"
      transparent={true}
      visible={createModalVisible}
      onRequestClose={() => setCreateModalVisible(false)}
    >
      <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} TextInputRef={TextInputRef} />
    </Modal>
     
    <Modal
      animationType="slide"
      transparent={true}
      visible={joinModalVisible}
      onRequestClose={() => setJoinModalVisible(false)}
    >
      <JoinTeamModal setVisible={setJoinModalVisible} refreshTeams={refreshTeams} />
    </Modal> 

    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Edit Team</Text>
          <TextInput
            placeholder=" Team Name"
            value={teamName}
            onChangeText={setTeamName}
            placeholderTextColor={"gray"}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
            <Image source={{ uri: imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal> 

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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isDeleteModalVisible}
      onRequestClose={() => setIsDeleteModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Warning</Text>
          <Text style={styles.modalText}>Are you sure you want to delete this team?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTeam}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setIsDeleteModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
      
      {/* <View style={styles.container}>
  <Button title="Open Create Team Modal" onPress={() => setCreateModalVisible(true)} />
  {createModalVisible && (
    <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} />
  )}
</View> */}


  {createModalVisible && (
    <CreateTeamModal setVisible={setCreateModalVisible} refreshTeams={refreshTeams} />
  )}


      

    <ButtonTools buttons={buttons} />
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: scaleSize(6),
    backgroundColor: 'black',
  },
  categoryName: {
    fontSize: scaleSize(25),
    fontWeight: 'bold',   marginTop: scaleSize(0),
    color: 'white',
    textAlign: 'center', // Center the text
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleSize(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: scaleSize(16),
    backgroundColor: 'gray',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: scaleSize(10),
    width: scaleSize(20),
    height: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  welcomeText: {
    fontSize: scaleSize(24),
    marginBottom: scaleSize(20),
  },
  button: {
    elevation: 5,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    padding: scaleSize(10),
    borderRadius: scaleSize(5),
    justifyContent: 'space-between',
    marginVertical: scaleSize(2),
  },
  primaryButton: {
    elevation: 5,
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: scaleSize(90),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleSize(20),
    marginHorizontal: scaleSize(5),
  },
  buttonText: {
    color: 'white',
    fontSize: scaleSize(15),
    fontWeight: 'bold',
  },
  title: {
    fontSize: scaleSize(24),
    fontWeight: 'bold',
    marginVertical: scaleSize(8),
    color: '#f0f0f0',
  },
  teamItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    padding: scaleSize(1),
    marginVertical: scaleSize(4),
    backgroundColor: 'rgba(172, 188, 198, 0.20)',
    borderRadius: scaleSize(30),
  },
  noTeamsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTeamsImage: {
    width: scaleSize(260),
    height: scaleSize(460),
    marginBottom: scaleSize(10),
    borderRadius: scaleSize(30),
  },
  noTeamsText: {
    fontSize: scaleSize(22),
    color: 'white',
    textAlign: 'center', paddingHorizontal: scaleSize(30),paddingVertical: scaleSize(10),
    marginBottom: scaleSize(30), marginTop: scaleSize(30),
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
    width: scaleSize(130),
    height: scaleSize(130),
    borderRadius: scaleSize(25),
  },
  teamInfo: {
    marginLeft: scaleSize(16),
    flex: 1,
  },
  teamName: {
    fontWeight: 'bold',
    fontSize: scaleSize(24),
    color: '#f0f0f0',
  },
  teamDetail: {
    fontSize: scaleSize(18),
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginTop: scaleSize(6),
  },
  teamMembersDetail: {
    fontSize: scaleSize(15),
    color: 'gray',
    marginTop: scaleSize(4),
  },
  menuButton: {
    color: 'white',
    fontSize: scaleSize(28),
    padding: scaleSize(16),
  },
  icon: {
    marginLeft: scaleSize(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',     backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: scaleSize(1),
    fontSize: scaleSize(24),
  },
  lottieAnimation: {
    width: scaleSize(350),
    height: scaleSize(350),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleSize(22),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    borderRadius: scaleSize(40),
    padding: scaleSize(20),
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'black',
  },
  modalTitle: {
    fontSize: scaleSize(20),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: scaleSize(10),
  },
  modalText: {
    color: 'white',
    fontSize: scaleSize(26),
    marginBottom: scaleSize(20),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  deleteButton: {
    width: '45%',
    elevation: 5,
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(10),
    backgroundColor: 'rgba(172, 188, 198, 0.43)',
    borderRadius: scaleSize(90),
    alignItems: 'center',
    marginHorizontal: scaleSize(5),
    justifyContent: 'center',
    marginBottom: scaleSize(10),
  },
  cancelButton: {
    width: '45%',
    elevation: 5,
    paddingVertical: scaleSize(10),
    marginHorizontal: scaleSize(5),
    paddingHorizontal: scaleSize(10),
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: scaleSize(90),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleSize(10),
  },
  input: {
    height: scaleSize(40),
    borderColor: '#ccc',
    borderWidth: scaleSize(1.4),
    borderRadius: scaleSize(20),
    marginBottom: scaleSize(12),
    paddingHorizontal: scaleSize(8),
    width: scaleSize(200),
    color: 'gray',
  },
  image: {
    width: scaleSize(150),
    borderRadius: scaleSize(30),
    height: scaleSize(150),
    marginBottom: scaleSize(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerModal: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: scaleSize(40),
    padding: scaleSize(60),
    alignItems: 'center',
  },
  imagePickerTitle: {
    fontSize: scaleSize(20),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: scaleSize(10),
  },
  imagePickerSubtitle: {
    fontSize: scaleSize(16),
    color: 'white',
    marginBottom: scaleSize(20),
  },
  imagePickerOptions: {
    width: '100%',
  },
  imagePickerOptionText: {
    fontSize: scaleSize(19),
    color: 'white',
    padding: scaleSize(8),
    textAlign: 'center',
  },
});

export default React.memo(HomeScreen);