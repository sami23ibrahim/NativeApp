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



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../config/firebase';
import CreateTeamModal from '../components/CreateTeamModal';
import JoinTeamModal from '../components/JoinTeamModal';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create' or 'join'
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

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
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
      <Text style={styles.title}>Your Teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.teamItem}
            onPress={() => navigation.navigate('CategoryListScreen', { teamId: item.id })}
          >
            <Text style={styles.teamName}>{item.name}</Text>
          </TouchableOpacity>
        )}
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
        ) : (
          <JoinTeamModal setVisible={setModalVisible} refreshTeams={refreshTeams} />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  teamItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teamName: {
    fontSize: 16,
  },
});

export default HomeScreen;
