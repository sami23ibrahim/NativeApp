


// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../config/firebase';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

// const ManageTeamScreen = ({ route }) => {
//   const { teamId, teamName } = route.params;
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [isOwner, setIsOwner] = useState(false);
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         const teamDoc = await getDoc(doc(firestore, 'teams', teamId));
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
//           const members = teamData.members.map(member => {
//             return {
//               ...member,
//               role: member.admin ? 'admin' : 'member',
//               isOwner: member.uid === teamData.owner.uid,
//               imageUrl: member.imageUrl || 'https://via.placeholder.com/50', // Use placeholder if no imageUrl
//             };
//           });
//           setTeamMembers(members);
//           setIsOwner(teamData.owner.uid === user.uid);
//         } else {
//           Alert.alert('Error', 'Team not found.');
//         }
//       } catch (error) {
//         console.error('Error fetching team members:', error);
//         Alert.alert('Error', 'Failed to fetch team members.');
//       }
//     };

//     fetchTeamMembers();
//   }, [teamId]);

//   const toggleAdminStatus = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const updatedMembers = teamMembers.map(m => 
//         m.uid === member.uid ? { ...m, admin: !m.admin } : m
//       );
//       await updateDoc(teamRef, { members: updatedMembers });
//       setTeamMembers(updatedMembers);
//       Alert.alert('Success', `${member.name} is now ${!member.admin ? 'an admin' : 'not an admin'}.`);
//     } catch (error) {
//       console.error('Error updating member status:', error);
//       Alert.alert('Error', 'Failed to update member status.');
//     }
//   };

//   const deleteUser = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       await updateDoc(teamRef, { members: arrayRemove(member) });
//       setTeamMembers(teamMembers.filter(m => m.uid !== member.uid));
//       Alert.alert('Success', `${member.name} has been removed from the team.`);
//     } catch (error) {
//       console.error('Error removing member:', error);
//       Alert.alert('Error', 'Failed to remove member.');
//     }
//   };

//   const renderMemberItem = ({ item }) => (
//     <View style={styles.memberItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.memberImage} />
//       <View style={styles.memberInfo}>
//         <View style={styles.nameContainer}>
//           <Text style={styles.memberName}>{item.name}</Text>
//           {item.isOwner && <MaterialCommunityIcons name="crown" size={20} color="gold" style={styles.icon} />}
//         </View>
//         <Text style={styles.memberRole}>{item.role === 'admin' ? 'Admin' : 'Member'}</Text>
//       </View>
//       {isOwner && !item.isOwner && (
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
//           </MenuTrigger>
//           <MenuOptions>
//             <MenuOption onSelect={() => toggleAdminStatus(item)} text={item.admin ? 'Remove Admin' : 'Make Admin'} />
//             <MenuOption onSelect={() => deleteUser(item)} text="Delete User" />
//           </MenuOptions>
//         </Menu>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Team "{teamName}" Members:</Text>
//       <FlatList
//         data={teamMembers}
//         keyExtractor={(item) => item.uid}
//         renderItem={renderMemberItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   memberImage: {
//     width: 65,
//     height: 65,
//     borderRadius: 90,
//     marginRight: 25,
//     marginBottom: 8,
//   },
//   memberInfo: {
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//   },
//   memberRole: {
//     fontSize: 16,
//     marginTop: 0,
//     marginBottom: 12,
//     color: 'green',
//   },
//   icon: {
//     marginLeft: 5,
//   },
// });

// export default ManageTeamScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

// const ManageTeamScreen = ({ route }) => {
//   const { teamId, teamName } = route.params;
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [isOwner, setIsOwner] = useState(false);
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         const teamDoc = await getDoc(doc(firestore, 'teams', teamId));
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
//           const members = teamData.members.map(member => {
//             return {
//               ...member,
//               role: member.admin ? 'admin' : 'member',
//               isOwner: member.uid === teamData.owner.uid,
//               imageUrl: member.imageUrl || 'https://via.placeholder.com/50', // Use placeholder if no imageUrl
//             };
//           });
//           setTeamMembers(members);
//           setIsOwner(teamData.owner.uid === user.uid);
//         } else {
//           Alert.alert('Error', 'Team not found.');
//         }
//       } catch (error) {
//         console.error('Error fetching team members:', error);
//         Alert.alert('Error', 'Failed to fetch team members.');
//       }
//     };

//     fetchTeamMembers();
//   }, [teamId]);

//   const toggleAdminStatus = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const updatedMembers = teamMembers.map(m => 
//         m.uid === member.uid ? { ...m, admin: !m.admin } : m
//       );
//       await updateDoc(teamRef, { members: updatedMembers });
//       setTeamMembers(updatedMembers);
//       Alert.alert('Success', `${member.name} is now ${!member.admin ? 'an admin' : 'not an admin'}.`);
//     } catch (error) {
//       console.error('Error updating member status:', error);
//       Alert.alert('Error', 'Failed to update member status.');
//     }
//   };

//   const deleteUser = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const updatedMembers = teamMembers.filter(m => m.uid !== member.uid);
//       await updateDoc(teamRef, { members: updatedMembers });
      
//       // Remove team from user's teams array
//       const userRef = doc(firestore, 'users', member.uid);
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const userTeams = userData.teams.filter(team => team.teamId !== teamId);
//         await updateDoc(userRef, { teams: userTeams });
//       }

//       setTeamMembers(updatedMembers);
//       Alert.alert('Success', `${member.name} has been removed from the team.`);
//     } catch (error) {
//       console.error('Error removing member:', error);
//       Alert.alert('Error', 'Failed to remove member.');
//     }
//   };

//   const renderMemberItem = ({ item }) => (
//     <View style={styles.memberItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.memberImage} />
//       <View style={styles.memberInfo}>
//         <View style={styles.nameContainer}>
//           <Text style={styles.memberName}>{item.name}</Text>
//           {item.isOwner && <MaterialCommunityIcons name="crown" size={30} color="gold" style={styles.icon} />}
//         </View>
//         <Text style={styles.memberRole}>{item.role === 'admin' ? 'Admin' : 'Member'}</Text>
//       </View>
//       {isOwner && !item.isOwner && (
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
//           </MenuTrigger>
//           <MenuOptions>
//             <MenuOption onSelect={() => toggleAdminStatus(item)} text={item.admin ? 'Remove Admin' : 'Make Admin'} />
//             <MenuOption onSelect={() => deleteUser(item)} text="Remove User" />
//           </MenuOptions>
//         </Menu>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Team "{teamName}" Members:</Text>
//       <FlatList
//         data={teamMembers}
//         keyExtractor={(item) => item.uid}
//         renderItem={renderMemberItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,  backgroundColor: '#9cacbc',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20, color: 'white',
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   memberImage: {
//     width: 75,
//     height: 75,
//     borderRadius: 90,
//     marginRight: 25,
//     marginBottom: 8,
//   },
//   memberInfo: {
//     flex: 1, color: 'white',
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,   color: 'white',
//   },
//   memberRole: {
//     fontSize: 16,
//     marginTop: 0,
//     marginBottom: 12,
//     color: '#aaf0c9',
//   },
//   icon: {
//     marginLeft: 15,
//   },
// });

// export default ManageTeamScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, Button } from 'react-native';
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

// const ManageTeamScreen = ({ route }) => {
//   const { teamId, teamName } = route.params;
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [isOwner, setIsOwner] = useState(false);
//   const firestore = getFirestore();
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         const teamDoc = await getDoc(doc(firestore, 'teams', teamId));
//         if (teamDoc.exists()) {
//           const teamData = teamDoc.data();
//           const members = teamData.members.map(member => {
//             return {
//               ...member,
//               role: member.admin ? 'admin' : 'member',
//               isOwner: member.uid === teamData.owner.uid,
//               imageUrl: member.imageUrl || 'https://via.placeholder.com/50', // Use placeholder if no imageUrl
//             };
//           });
//           setTeamMembers(members);
//           setIsOwner(teamData.owner.uid === user.uid);
//         } else {
//           Alert.alert('Error', 'Team not found.');
//         }
//       } catch (error) {
//         console.error('Error fetching team members:', error);
//         Alert.alert('Error', 'Failed to fetch team members.');
//       }
//     };

//     fetchTeamMembers();
//   }, [teamId]);

//   const toggleAdminStatus = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const updatedMembers = teamMembers.map(m => 
//         m.uid === member.uid ? { ...m, admin: !m.admin } : m
//       );
//       await updateDoc(teamRef, { members: updatedMembers });
//       setTeamMembers(updatedMembers);
//       Alert.alert('Success', `${member.name} is now ${!member.admin ? 'an admin' : 'not an admin'}.`);
//     } catch (error) {
//       console.error('Error updating member status:', error);
//       Alert.alert('Error', 'Failed to update member status.');
//     }
//   };

//   const deleteUser = async (member) => {
//     try {
//       const teamRef = doc(firestore, 'teams', teamId);
//       const updatedMembers = teamMembers.filter(m => m.uid !== member.uid);
//       await updateDoc(teamRef, { members: updatedMembers });
      
//       // Remove team from user's teams array
//       const userRef = doc(firestore, 'users', member.uid);
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const userTeams = userData.teams.filter(team => team.teamId !== teamId);
//         await updateDoc(userRef, { teams: userTeams });
//       }

//       setTeamMembers(updatedMembers);
//       Alert.alert('Success', `${member.name} has been removed from the team.`);
//     } catch (error) {
//       console.error('Error removing member:', error);
//       Alert.alert('Error', 'Failed to remove member.');
//     }
//   };

//   const renderMemberItem = ({ item }) => (
//     <View style={styles.memberItem}>
//       <Image source={{ uri: item.imageUrl }} style={styles.memberImage} />
//       <View style={styles.memberInfo}>
//         <View style={styles.nameContainer}>
//           <Text style={styles.memberName}>{item.name}</Text>
//           {item.isOwner && <MaterialCommunityIcons name="crown" size={30} color="gold" style={styles.icon} />}
//         </View>
//         <Text style={styles.memberRole}>{item.role === 'admin' ? 'Admin' : 'Member'}</Text>
//       </View>
//       {isOwner && !item.isOwner && (
//         <Menu>
//           <MenuTrigger>
//             <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
//           </MenuTrigger>
//           <MenuOptions>
//             <MenuOption onSelect={() => toggleAdminStatus(item)} text={item.admin ? 'Remove Admin' : 'Make Admin'} />
//             <MenuOption onSelect={() => deleteUser(item)} text="Remove User" />
//           </MenuOptions>
//         </Menu>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Team "{teamName}" Members:</Text>
//       <Button title="Copy Team ID" onPress={() => Clipboard.setString(teamId)} />
//       <FlatList
//         data={teamMembers}
//         keyExtractor={(item) => item.uid}
//         renderItem={renderMemberItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#9cacbc',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     color: 'white',
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   memberImage: {
//     width: 75,
//     height: 75,
//     borderRadius: 90,
//     marginRight: 25,
//     marginBottom: 8,
//   },
//   memberInfo: {
//     flex: 1,
//     color: 'white',
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 6,
//     color: 'white',
//   },
//   memberRole: {
//     fontSize: 16,
//     marginTop: 0,
//     marginBottom: 12,
//     color: '#aaf0c9',
//   },
//   icon: {
//     marginLeft: 15,
//   },
// });

// export default ManageTeamScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, Share, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ManageTeamScreen = ({ route }) => {
  const { teamId, teamName } = route.params;
  const [teamMembers, setTeamMembers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const shareTeamId = async () => {
    try {
      await Share.share({
        message: `${teamId}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the team ID');
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamDoc = await getDoc(doc(firestore, 'teams', teamId));
        if (teamDoc.exists()) {
          const teamData = teamDoc.data();
          const members = teamData.members.map(member => {
            return {
              ...member,
              role: member.admin ? 'admin' : 'member',
              isOwner: member.uid === teamData.owner.uid,
              imageUrl: member.imageUrl || 'https://via.placeholder.com/50',
            };
          });
          setTeamMembers(members);
          setIsOwner(teamData.owner.uid === user.uid);
        } else {
          Alert.alert('Error', 'Team not found.');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        Alert.alert('Error', 'Failed to fetch team members.');
      }
    };

    fetchTeamMembers();
  }, [teamId]);

  useEffect(() => {
    const q = query(collection(firestore, 'joinRequests'), where('teamId', '==', teamId), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJoinRequests(requests);
    });

    return () => unsubscribe();
  }, [teamId]);

  const handleRequest = async (requestId, action) => {
    try {
      const requestRef = doc(firestore, 'joinRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        Alert.alert('Error', 'Join request not found.');
        return;
      }

      const requestData = requestDoc.data();
      const teamRef = doc(firestore, 'teams', requestData.teamId);

      if (action === 'approve') {
        // Check if the user exists before approving the request
        const userRef = doc(firestore, 'users', requestData.userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // If user doesn't exist, alert the owner and delete the request
          Alert.alert('Error', 'User no longer exists.');
          await deleteDoc(requestRef);
          return;
        }

        // Proceed with approval if user exists
        await updateDoc(teamRef, {
          members: arrayUnion({
            uid: requestData.userId,
            name: requestData.userName,
            imageUrl: requestData.userImageUrl,
            admin: false
          })
        });

        await updateDoc(doc(firestore, 'users', requestData.userId), {
          teams: arrayUnion({
            teamId: requestData.teamId,
            uid: requestData.userId
          })
        });
      }

      await deleteDoc(requestRef);

      Alert.alert('Success', `User has been ${action === 'approve' ? 'approved' : 'rejected'}.`);
    } catch (error) {
      console.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} join request: `, error);
      Alert.alert('Error', `Failed to ${action === 'approve' ? 'approve' : 'reject'} join request.`);
    }
  };

  const deleteUser = async (member) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const userRef = doc(firestore, 'users', member.uid);

      // Fetch the latest team document
      const teamDoc = await getDoc(teamRef);
      const teamData = teamDoc.data();

      // Find the member object in the team members array
      const memberToRemove = teamData.members.find(m => m.uid === member.uid);

      // Remove user from the team's members array
      await updateDoc(teamRef, {
        members: arrayRemove(memberToRemove)
      });

      // Remove team from the user's teams array
      await updateDoc(userRef, {
        teams: arrayRemove({ teamId, uid: member.uid })
      });

      // Update the team members state
      setTeamMembers((prevMembers) => prevMembers.filter((m) => m.uid !== member.uid));

      Alert.alert('Success', 'User has been removed.');
    } catch (error) {
      console.error('Error removing user:', error);
      Alert.alert('Error', 'Failed to remove user.');
    }
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.memberImage} />
      <View style={styles.memberInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.memberName}>{item.name}</Text>
          {item.isOwner && <MaterialCommunityIcons name="crown" size={30} color="gold" style={styles.icon} />}
        </View>
        <Text style={styles.memberRole}>{item.role === 'admin' ? 'Admin' : 'Member'}</Text>
      </View>
      {isOwner && !item.isOwner && (
        <Menu>
          <MenuTrigger>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => toggleAdminStatus(item)} text={item.admin ? 'Remove Admin' : 'Make Admin'} />
            <MenuOption onSelect={() => deleteUser(item)} text="Remove User" />
          </MenuOptions>
        </Menu>
      )}
    </View>
  );

  const renderJoinRequestItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.userImageUrl }} style={styles.memberImage} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.userName}</Text>
        <Text style={styles.memberRole}>Pending</Text>
      </View>
      {isOwner && (
      <View style={styles.requestActions}>
      <TouchableOpacity onPress={() => handleRequest(item.id, 'approve')} style={styles.iconButton}>
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons name="thumb-up" size={26} color="white" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRequest(item.id, 'reject')} style={styles.iconButton}>
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons name="thumb-down" size={26} color="white" />
        </View>
      </TouchableOpacity>
    </View>
    
     
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{teamName} Members:</Text>
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.uid}
        renderItem={renderMemberItem}
        ListFooterComponent={
          <FlatList
            data={joinRequests}
            keyExtractor={(item) => item.id}
            renderItem={renderJoinRequestItem}
          />
        }
      />
      <TouchableOpacity style={styles.primaryButton} onPress={shareTeamId}>
        <Text style={styles.buttonText}>Share Invitation Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9cacbc',
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
  },
  buttonText: {
    color: 'white', // Change this to your desired text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures the text is centered
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: '#f0f0f0',
    fontWeight: 'bold',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberImage: {
    width: 75,
    height: 75,
    borderRadius: 90,
    marginRight: 25,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
    color: '#f0f0f0',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#f0f0f0',
  },
  memberRole: {
    fontSize: 18,
    marginTop: 6,
    marginBottom: 10,
    color: '#b2d3c2',
  },
  icon: {
    marginLeft: 19,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: 'rgba(172, 188, 198, 0.33)',
    borderRadius: 50, // This makes the background a circle
    padding: 10, // Adjust the padding to control the size of the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
});

export default ManageTeamScreen;
