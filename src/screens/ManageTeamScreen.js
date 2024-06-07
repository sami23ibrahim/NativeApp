


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



import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ManageTeamScreen = ({ route }) => {
  const { teamId, teamName } = route.params;
  const [teamMembers, setTeamMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

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
              imageUrl: member.imageUrl || 'https://via.placeholder.com/50', // Use placeholder if no imageUrl
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

  const toggleAdminStatus = async (member) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const updatedMembers = teamMembers.map(m => 
        m.uid === member.uid ? { ...m, admin: !m.admin } : m
      );
      await updateDoc(teamRef, { members: updatedMembers });
      setTeamMembers(updatedMembers);
      Alert.alert('Success', `${member.name} is now ${!member.admin ? 'an admin' : 'not an admin'}.`);
    } catch (error) {
      console.error('Error updating member status:', error);
      Alert.alert('Error', 'Failed to update member status.');
    }
  };

  const deleteUser = async (member) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const updatedMembers = teamMembers.filter(m => m.uid !== member.uid);
      await updateDoc(teamRef, { members: updatedMembers });
      
      // Remove team from user's teams array
      const userRef = doc(firestore, 'users', member.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userTeams = userData.teams.filter(team => team.teamId !== teamId);
        await updateDoc(userRef, { teams: userTeams });
      }

      setTeamMembers(updatedMembers);
      Alert.alert('Success', `${member.name} has been removed from the team.`);
    } catch (error) {
      console.error('Error removing member:', error);
      Alert.alert('Error', 'Failed to remove member.');
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
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => toggleAdminStatus(item)} text={item.admin ? 'Remove Admin' : 'Make Admin'} />
            <MenuOption onSelect={() => deleteUser(item)} text="Remove User" />
          </MenuOptions>
        </Menu>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team "{teamName}" Members:</Text>
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.uid}
        renderItem={renderMemberItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberImage: {
    width: 65,
    height: 65,
    borderRadius: 90,
    marginRight: 25,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  memberRole: {
    fontSize: 16,
    marginTop: 0,
    marginBottom: 12,
    color: 'green',
  },
  icon: {
    marginLeft: 15,
  },
});

export default ManageTeamScreen;
