import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Pressable } from 'react-native';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DeleteUser from './DeleteUser';

export default function CreateUser() {
  const [user, setUser] = useState({ username: '' });
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const usersQuery = collection(db, 'users');
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPeople(usersList);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addUser = () => {
    const userDb = collection(db, 'users');
    addDoc(userDb, {
      username: user.username,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.username}</Text>
      <DeleteUser id={item.id} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Add username"
        value={user.username}
        onChangeText={(text) => setUser({ ...user, username: text })}
      />
      <Pressable onPress={addUser}>
        <Text style={styles.text}>Click to Create</Text>
      </Pressable>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={people}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  input: {
    backgroundColor: 'blue',
    color: 'white',
    width: '80%',
    padding: 10,
    marginVertical: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 20,
  },
  text: {
    padding: 10,
    color: 'white',
    backgroundColor: 'blue',
    borderBottomColor: '#ccc',
    marginTop: 20,
  },
});
