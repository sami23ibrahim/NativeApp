// src/screens/TestModalScreen.js
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import CreateTeamModal from '../components/CreateTeamModal';

const TestModalScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Create Team Modal" onPress={() => setModalVisible(true)} />
      {modalVisible && <CreateTeamModal setVisible={setModalVisible} refreshTeams={() => {}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestModalScreen;
