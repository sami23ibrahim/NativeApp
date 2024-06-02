import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../config/firebase';

const ManageTeamScreen = ({ route }) => {
  const { teamId, teamName } = route.params;
  const [teamMembers, setTeamMembers] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamDoc = await getDoc(doc(firestore, 'teams', teamId));
        if (teamDoc.exists()) {
          const members = teamDoc.data().members;
          setTeamMembers(members);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team "{teamName}" Members:</Text>
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.memberItem}>{item}</Text>}
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ManageTeamScreen;
