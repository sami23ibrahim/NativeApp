import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './src/config/firebase';
import CreateUser from './src/components/CreateUser';
import DeleteUser from './src/components/DeleteUser';
export default function App() {
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.username}</Text>
      <DeleteUser id={item.id}/>
    </View>
  );
  return (
  
    <View style={styles.container}>
      < CreateUser/>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
         data={people} 
         renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',marginTop:50,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',marginTop:20,
  },
});
