import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList,TextInput,Pressable, TextInputBase } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function DeleteUser({id}) {
 

function deleteUser(){
    const user= doc(db,'users',id)
deleteDoc(user)
}
  return (
    <View >
        <Pressable onPress={deleteUser}>
<Text style={styles.text}>deleteUser</Text>
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
backgroundColor:'red',
    borderBottomColor: '#ccc',marginTop:20,
  },
});
