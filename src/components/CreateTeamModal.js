import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../config/firebase';

const CreateTeamModal = ({ setVisible, refreshTeams }) => {
  const [teamName, setTeamName] = useState('');
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;

  const handleCreateTeam = async () => {
    try {
      await addDoc(collection(firestore, 'teams'), {
        name: teamName,
        admin: user.uid,
        members: [user.uid],
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
});

export default CreateTeamModal;
