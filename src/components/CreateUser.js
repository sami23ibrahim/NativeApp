import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList,TextInput,Pressable, TextInputBase } from 'react-native';
import { collection, onSnapshot,addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CreateUser() {
  const [user, setUser] = useState({username:''});

function addUser(){
    const userDb = collection(db,'users')
addDoc(userDb,{
username:user.username,
     
})
}
  return (
    <View >
        <TextInput
        backgroundColor='blue'
        color='white'
        TextInputBase='white'
        placeholderTextColor='white'
        placeholder='add username'
        value={user.username}
        onChangeText={(text)=>setUser({...user,username:text})}/>
        <Pressable onPress={addUser}>
<Text style={styles.text}>click to Create</Text>
        </Pressable>
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
  text: {
    padding: 10,color:'white',
backgroundColor:'blue',
    borderBottomColor: '#ccc',marginTop:20,
  },
});
