
import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, storage } from '../config/firebase';
import CreateTeamModal from '../components/CreateTeamModal';
import JoinTeamModal from '../components/JoinTeamModal';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import LottieView from 'lottie-react-native'; // Import LottieView
import NotificationTestScreen from '../screens/NotificationTestScreen';
//import { NotificationContext } from '../components/NotificationProvider';
import NotificationBadge from '../components/NotificationBadge'; // Ensure this import is correct

const HomeScreen = ({ navigation }) => {
  
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'join', or 'edit'
  const [editTeam, setEditTeam] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(true); // New state for loading teams
  const auth = FIREBASE_AUTH;
  const firestore = getFirestore();
  const user = auth.currentUser;
 // const { notifications, clearNotifications, unreadCount } = useContext(NotificationContext);
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
      } finally {
        setTimeout(() => setLoadingTeams(false), 1000); // Ensure loading screen stays for at least 3 seconds
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
  <MenuOptions customStyles={{ optionsContainer: {
     backgroundColor: '#9cacbc' ,
     paddingVertical: 10,
     borderRadius: 20,
     paddingHorizontal: 15,
     backgroundColor: 'rgba(172, 188, 198, 1.7)',
     fontSize: 28,
     color: 'white',
     } }}>
    {isOwner ? (
      <>
        <MenuOption
          onSelect={() => {
            setEditTeam(item);
            setTeamName(item.name);
            setImageUri(item.imageUrl);
            setModalType('edit');
            setModalVisible(true);
          }}
          text="Edit"
          customStyles={{ optionText: { color: 'white', fontSize: 22, } }}
        />
        <MenuOption
          onSelect={() => confirmDeleteTeam(item.id)}
          text="Delete"
          customStyles={{ optionText: { color: 'white', fontSize: 22, } }}
        />
      </>
    ) : (
      <MenuOption
        onSelect={() => handleLeaveTeam(item.id)}
        text="Leave Team"
        customStyles={{ optionText: { color: 'white', fontSize: 22, } }}
      />
    )}
  </MenuOptions>
</Menu>


      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY TEAMS</Text>
      <View style={styles.listContainer}>
        {loadingTeams ? (
          <View style={styles.loadingContainer}>
             <Text style={styles.loadingText}>Loading...Hold tight!</Text>
            <LottieView
              source={require('../../assets/loading2.json')} 
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
        ) : (
          <>
          {teams.length === 0 ? (
  <View style={styles.noTeamsContainer}>
    <Text style={styles.noTeamsText}>
    You are not currently a member of any teams. Please join an existing team or create your own!
    </Text>
    <Image
      source={require('../../assets/noteam.png')}
      style={styles.noTeamsImage}
    />
  </View>
) : (
  <FlatList
    data={teams}
    keyExtractor={(item) => item.id}
    renderItem={renderTeamItem}
  />
)}
          </>
        )}
      </View>
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
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Team</Text>
              <TextInput
                placeholder="Team Name"
                value={teamName}
                onChangeText={setTeamName}
                placeholderTextColor={"white"}
                style={styles.input}
              />
              <TouchableOpacity onPress={selectImage}>
                <Image
                  source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
                  style={styles.image}
                />
              </TouchableOpacity>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <>
         <View style={styles.buttonRow}>
  <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditTeam}>
    <Text style={styles.buttonText}>Update</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(false)}>
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>
</View>

            

                   
                </>
              )}
            </View>
          </View>
        )}
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
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonRow}>


      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => {
          setModalType('create');
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Create Team</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => {
          setModalType('join');
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Join Team</Text>
      </TouchableOpacity>
      </View>


    </View>
  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'right',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#9cacbc', // Change this to your desired background color
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this as needed
    marginTop: 20, // Add some margin to separate from other elements
   
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'right',
    padding: 16,
    backgroundColor: 'gray',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'right',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
    padding: 10,
    borderRadius: 5,  justifyContent: 'space-between',
    marginVertical: 2,
  },
  primaryButton: {
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list  
    marginHorizontal: 5, // Add margin between the buttons
    },
  buttonText: {
    color: 'white',
    fontSize: 19,fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  teamItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',  alignSelf: 'center', // Center the item container
    padding: 5,
    marginVertical: 7, // Add margin to create space between items
    backgroundColor: 'rgba(172, 188, 198, 0.33)', // Set background color with transparency (0.7 for 70% opacity)
    borderRadius: 30, // Add rounded corners
  },
  noTeamsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTeamsImage: {
    width: 300,
    height: 460,
    marginBottom: 10, borderRadius: 30
  },
  noTeamsText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
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
    color: 'white',
  },
  teamDetail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
  },
  menuButton: {
    color: 'white',
    fontSize: 30,
    padding: 10,
  },
  icon: {
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 1,
    fontSize: 24,
  },
  lottieAnimation: {
    width: 650,
    height: 750,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    
    borderRadius: 40,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,backgroundColor: 'rgba(172, 188, 198, 1.7)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',color: 'white',
    marginBottom: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    width:'45%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    marginHorizontal: 5, // Add margin between the buttons
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.4,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 200,color: 'white',
  },
  image: {
    width: 150,borderRadius: 30,
    height: 150,
    marginBottom: 20,
  },
  
});


export default HomeScreen;



