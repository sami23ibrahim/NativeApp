// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create' or 'join'
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//         const querySnapshot = await getDocs(q);
//         const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeams(userTeams);
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
//       const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTeams(userTeams);
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
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
//       {/* <Text style={styles.title}>Your Teams</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <Text style={styles.teamItem}>{item.name}</Text>}
//       /> */}
//       <Button title="Sign Out" onPress={handleSignOut} />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         {modalType === 'create' ? (
//           <CreateTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         ) : (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         )}
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItem: {
//     fontSize: 16,
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default HomeScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create' or 'join'
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//         const querySnapshot = await getDocs(q);
//         const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeams(userTeams);
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
//       const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTeams(userTeams);
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
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
//       <Text style={styles.title}>Available Teams (for testing)</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.teamItem}>
//             <Text>Team Name: {item.name}</Text>
//             <Text>Team ID: {item.id}</Text>
//           </View>
//         )}
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
//         ) : (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         )}
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItem: {
//     fontSize: 16,
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default HomeScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create' or 'join'
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//         const querySnapshot = await getDocs(q);
//         const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeams(userTeams);
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
//       const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTeams(userTeams);
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>Home Screen</Text>
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
//       <Text style={styles.title}>Your Teams</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.teamItem}
//             onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id })}
//           >
//             <Text style={styles.teamName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
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
//         ) : (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         )}
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamName: {
//     fontSize: 16,
//   },
// });

// export default HomeScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create' or 'join'
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//         const querySnapshot = await getDocs(q);
//         const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeams(userTeams);
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
//       const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTeams(userTeams);
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
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
//       <Text style={styles.title}>Your Teams</Text>
//       <FlatList
//         data={teams}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.teamItem}
//             onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//           >
//             <Text style={styles.teamName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
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
//         ) : (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
//         )}
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   teamItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   teamName: {
//     fontSize: 16,
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
// });

// export default HomeScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
// import CreateTeamModal from '../components/CreateTeamModal';
// import JoinTeamModal from '../components/JoinTeamModal';
// import { useNavigation } from '@react-navigation/native';

// const HomeScreen = ({ navigation }) => {
//   const [teams, setTeams] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'create' or 'join'
//   const auth = FIREBASE_AUTH;
//   const firestore = getFirestore();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//         const querySnapshot = await getDocs(q);
//         const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeams(userTeams);
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
//       const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTeams(userTeams);
//     } catch (error) {
//       console.error('Error refreshing teams: ', error);
//     }
//   };

//   const renderTeamItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.teamItem}
//       onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
//     >
//       <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
//       <View style={styles.teamInfo}>
//         <Text style={styles.teamName}>{item.name}</Text>
//         <Text style={styles.teamDetail}>Admin: {item.admin}</Text>
//         <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
    
//       <Text style={styles.title}>Your Teams</Text>
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
//         ) : (
//           <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
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
//   teamItem: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     alignItems: 'center',
//   },
//   teamImage: {
//     width: 140,
//     height: 140,
//     borderRadius: 30,
//   },
//   teamInfo: {
//     marginLeft: 6,
//   },
//   teamName: {
//     fontWeight: 'bold',
//     fontSize: 22,
//   },
//   teamDetail: {
//     fontSize: 15,
//   },
// });

// export default HomeScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
import CreateTeamModal from '../components/CreateTeamModal';
import JoinTeamModal from '../components/JoinTeamModal';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
        const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(userTeams);
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
      const q = query(collection(firestore, 'teams'), where('members', 'array-contains', user.uid));
      const querySnapshot = await getDocs(q);
      const userTeams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(userTeams);
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

    if (!result.cancelled) {
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
      const imageUrl = await uploadImage(imageUri);
      const teamRef = doc(firestore, 'teams', editTeam.id);
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

  const handleDeleteTeam = async (teamId) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      await deleteDoc(teamRef);
      Alert.alert('Team deleted successfully!');
      refreshTeams();
    } catch (error) {
      console.error('Error deleting team: ', error);
      Alert.alert('Error', 'Failed to delete team.');
    }
  };

  const renderTeamItem = ({ item }) => (
    <View style={styles.teamItemContainer}>
      <TouchableOpacity
        style={styles.teamItem}
        onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id, teamName: item.name })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.teamImage} />
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text style={styles.teamDetail}>Admin: {item.admin}</Text>
          <Text style={styles.teamDetail}>Members: {item.members.length}</Text>
        </View>
      </TouchableOpacity>
      <Menu>
        <MenuTrigger>
          <Text style={styles.menuButton}>⋮</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => {
            setEditTeam(item);
            setTeamName(item.name); // Set the current team name
            setImageUri(item.imageUrl); // Set the current team image URL
            setModalType('edit');
            setModalVisible(true);
          }} text="Edit" />
          <MenuOption onSelect={() => handleDeleteTeam(item.id)} text="Delete" />
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={renderTeamItem}
      />
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
  teamImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teamInfo: {
    marginLeft: 6,
    flex: 1,
  },
  teamName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  teamDetail: {
    fontSize: 14,
  },
  menuButton: {
    fontSize: 30,
    padding: 10,
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

