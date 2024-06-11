

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, Platform, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../config/firebase';
// import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const CategoryDetailScreen = ({ route }) => {
//   const { categoryId } = route.params;
//   const [itemName, setItemName] = useState('');
//   const [itemImageUri, setItemImageUri] = useState('');
//   const [items, setItems] = useState([]);
//   const [editItem, setEditItem] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [addItemModalVisible, setAddItemModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     console.log('Fetching items for categoryId:', categoryId);
//     const itemsCollection = collection(db, `categories/${categoryId}/items`);
//     const itemsSnapshot = await getDocs(itemsCollection);
//     const itemsList = itemsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     console.log('Fetched items:', itemsList);
//     setItems(itemsList);
//   };

//   const selectItemImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       console.log('Image Picker Result:', result);
//       setItemImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `items/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         'state_changed',
//         null,
//         (error) => {
//           console.error('Upload failed', error);
//           reject(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           console.log('Image uploaded, download URL:', downloadURL);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addItem = async () => {
//     if (itemName && itemImageUri) {
//       setLoading(true);
//       try {
//         console.log('Adding item:', itemName, itemImageUri);
//         const imageUrl = await uploadImage(itemImageUri);
//         const newItem = {
//           name: itemName,
//           img: imageUrl,
//           quantity: 0
//         };
//         const docRef = await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
//         console.log('Item added with ID:', docRef.id);
//         fetchItems();
//         setItemName('');
//         setItemImageUri('');
//         setAddItemModalVisible(false);
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 2000); // Show success message for 2 seconds
//       } catch (error) {
//         console.error('Error adding item:', error);
//         Alert.alert('Error', 'There was an error adding your item.');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const deleteItem = async (itemId, imgUrl) => {
//     try {
//       console.log('Deleting item:', itemId);
//       const itemDocRef = doc(db, `categories/${categoryId}/items`, itemId);
//       await deleteDoc(itemDocRef);
//       const imgRef = ref(storage, imgUrl);
//       await deleteObject(imgRef);
//       fetchItems();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       Alert.alert('Error', 'There was an error deleting the item.');
//     }
//   };

//   const incrementQuantity = async (itemId, currentQuantity) => {
//     const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//     await updateDoc(itemRef, { quantity: currentQuantity + 1 });
//     fetchItems();
//   };

//   const decrementQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 0) {
//       const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//       await updateDoc(itemRef, { quantity: currentQuantity - 1 });
//       fetchItems();
//     }
//   };

//   const updateQuantity = async (itemId, newQuantity) => {
//     const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//     await updateDoc(itemRef, { quantity: newQuantity });
//     fetchItems();
//   };

//   const editItemDetails = (item) => {
//     setEditItem(item);
//     setItemName(item.name);
//     setItemImageUri(item.img);
//     setModalVisible(true);
//   };

//   const updateItem = async () => {
//     if (editItem) {
//       try {
//         let updatedImageUrl = editItem.img;
//         if (itemImageUri !== editItem.img) {
//           updatedImageUrl = await uploadImage(itemImageUri);
//         }

//         const itemRef = doc(db, `categories/${categoryId}/items`, editItem.id);
//         await updateDoc(itemRef, { name: itemName, img: updatedImageUrl });
//         fetchItems();
//         setModalVisible(false);
//         setEditItem(null);
//         setItemName('');
//         setItemImageUri('');
//       } catch (error) {
//         console.error('Error updating item:', error);
//         Alert.alert('Error', 'There was an error updating your item.');
//       }
//     }
//   };

//   return (
//     // <MenuProvider>
//       <KeyboardAwareScrollView
//         style={styles.container}
//         resetScrollToCoords={{ x: 0, y: 0 }}
//         contentContainerStyle={styles.container}
//         enableOnAndroid={true}
//       >
//         <View style={styles.headerContainer}>
//           <Button title="+ Add New Item" onPress={() => setAddItemModalVisible(true)} />
//         </View>
//         {items.map((item) => (
//           <View key={item.id} style={styles.itemContainer}>
//             <Image source={{ uri: item.img }} style={styles.itemImage} />
//             <View style={styles.itemDetails}>
//               <Text style={styles.itemName}>{item.name}</Text>
//               <View style={styles.quantityContainer}>
//                 <TouchableOpacity style={styles.circleButton} onPress={() => decrementQuantity(item.id, item.quantity)}>
//                   <Text style={styles.quantityButton}>-</Text>
//                 </TouchableOpacity>
//                 <TextInput
//                   style={styles.quantityInput}
//                   value={String(item.quantity)}
//                   keyboardType="numeric"
//                   onChangeText={(text) => updateQuantity(item.id, parseInt(text) || 0)}
//                 />
//                 <TouchableOpacity style={styles.circleButton} onPress={() => incrementQuantity(item.id, item.quantity)}>
//                   <Text style={styles.quantityButton}>+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <Menu>
//               <MenuTrigger>
//                 <Text style={styles.menuButton}>⋮</Text>
//               </MenuTrigger>
//               <MenuOptions>
//                 <MenuOption onSelect={() => editItemDetails(item)} text="Edit " />
      
//                 <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" />
//               </MenuOptions>
//             </Menu>
//           </View>
//         ))}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             setModalVisible(!modalVisible);
//             setEditItem(null);
//             setItemName('');
//             setItemImageUri('');
//           }}
//         >
//           <View style={styles.modalView}>
//             <TextInput
//               placeholder="Item Name"
//               value={itemName}
//               onChangeText={setItemName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectItemImage}>
//               <Image
//                 source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               <Button title="Update Item" onPress={() => {
//                 updateItem();
//                 setModalVisible(false);
//                 setItemName('');
//                 setItemImageUri('');
//               }} />
//               <View style={styles.buttonSpacing} />
//               <Button title="Cancel" onPress={() => {
//                 setModalVisible(false);
//                 setEditItem(null);
//                 setItemName('');
//                 setItemImageUri('');
//               }} />
//             </View>
//           </View>
//         </Modal>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={addItemModalVisible}
//           onRequestClose={() => {
//             setAddItemModalVisible(!addItemModalVisible);
//             setItemName('');
//             setItemImageUri('');
//           }}
//         >
//           <View style={styles.modalView}>
//             <TextInput
//               placeholder="Item Name"
//               value={itemName}
//               onChangeText={setItemName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectItemImage}>
//               <Image
//                 source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//               ) : (
//                 <>
//                   <Button title="Add Item" onPress={addItem} />
//                   <View style={styles.buttonSpacing} />
//                   <Button title="Cancel" onPress={() => {
//                     setAddItemModalVisible(false);
//                     setItemName('');
//                     setItemImageUri('');
//                   }} />
//                 </>
//               )}
//             </View>
//           </View>
//         </Modal>
//         {success && (
//           <View style={styles.successMessage}>
//             <Text style={styles.successText}>Item added successfully!</Text>
//           </View>
//         )}
//       </KeyboardAwareScrollView>
//    // </MenuProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   itemImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//   },
//   itemDetails: {
//     flex: 1,
//     marginLeft: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   circleButton: {
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     padding: 10,
//     marginHorizontal: 5,
//     elevation: 3,
//   },
//   quantityButton: {
//     fontSize: 30,
//     textAlign: 'center',
//   },
//   quantityInput: {
//     fontSize: 18,
//     textAlign: 'center',
//     width: 50,
//     borderBottomWidth: 1,
//     marginHorizontal: 10,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   successMessage: {
//     position: 'absolute',
//     top: 100, // Position it towards the top of the screen
    
//     left: 110,
//     transform: [{ translateX: -50 }],
//     backgroundColor: 'green',
//     padding: 20,
//     borderRadius: 10,
//     zIndex: 1, // Ensures the message is on top
//   },
//   successText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,

//   },
// });

// export default CategoryDetailScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../config/firebase';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { FIREBASE_AUTH } from '../config/firebase';

// const CategoryDetailScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { categoryId, categoryName, teamName } = route.params;
//   const [itemName, setItemName] = useState('');
//   const [itemImageUri, setItemImageUri] = useState('');
//   const [items, setItems] = useState([]);
//   const [editItem, setEditItem] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [addItemModalVisible, setAddItemModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [userRole, setUserRole] = useState(''); // To store the user's role
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     navigation.setOptions({ title: `"${teamName.toUpperCase()}" /${categoryName}` }); // Set the header title to the teamName/categoryName
//     fetchItemsAndRole();
//   }, [categoryId, categoryName, teamName]);

//   const fetchItemsAndRole = async () => {
//     console.log('Fetching items for categoryId:', categoryId);
//     const itemsCollection = collection(db, `categories/${categoryId}/items`);
//     const itemsSnapshot = await getDocs(itemsCollection);
//     const itemsList = itemsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     console.log('Fetched items:', itemsList);
//     setItems(itemsList);

//     // Fetch user role
//     const teamDocRef = doc(db, 'teams', teamName);
//     const teamDoc = await getDoc(teamDocRef);
//     if (teamDoc.exists()) {
//       const teamData = teamDoc.data();
//       const member = teamData.members.find(m => m.uid === user.uid);
//       if (member) {
//         setUserRole(member.admin ? 'admin' : 'member');
//       }
//     }
//   };

//   const selectItemImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       console.log('Image Picker Result:', result);
//       setItemImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `items/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         'state_changed',
//         null,
//         (error) => {
//           console.error('Upload failed', error);
//           reject(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           console.log('Image uploaded, download URL:', downloadURL);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addItem = async () => {
//     if (itemName && itemImageUri) {
//       setLoading(true);
//       try {
//         console.log('Adding item:', itemName, itemImageUri);
//         const imageUrl = await uploadImage(itemImageUri);
//         const newItem = {
//           name: itemName,
//           img: imageUrl,
//           quantity: 0
//         };
//         const docRef = await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
//         console.log('Item added with ID:', docRef.id);
//         fetchItemsAndRole();
//         setItemName('');
//         setItemImageUri('');
//         setAddItemModalVisible(false);
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 2000); // Show success message for 2 seconds
//       } catch (error) {
//         console.error('Error adding item:', error);
//         Alert.alert('Error', 'There was an error adding your item.');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const deleteItem = async (itemId, imgUrl) => {
//     try {
//       console.log('Deleting item:', itemId);
//       const itemDocRef = doc(db, `categories/${categoryId}/items`, itemId);
//       await deleteDoc(itemDocRef);
//       const imgRef = ref(storage, imgUrl);
//       await deleteObject(imgRef);
//       fetchItemsAndRole();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       Alert.alert('Error', 'There was an error deleting the item.');
//     }
//   };

//   const incrementQuantity = async (itemId, currentQuantity) => {
//     const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//     await updateDoc(itemRef, { quantity: currentQuantity + 1 });
//     fetchItemsAndRole();
//   };

//   const decrementQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 0) {
//       const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//       await updateDoc(itemRef, { quantity: currentQuantity - 1 });
//       fetchItemsAndRole();
//     }
//   };

//   const updateQuantity = async (itemId, newQuantity) => {
//     const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
//     await updateDoc(itemRef, { quantity: newQuantity });
//     fetchItemsAndRole();
//   };

//   const editItemDetails = (item) => {
//     setEditItem(item);
//     setItemName(item.name);
//     setItemImageUri(item.img);
//     setModalVisible(true);
//   };

//   const updateItem = async () => {
//     if (editItem) {
//       try {
//         let updatedImageUrl = editItem.img;
//         if (itemImageUri !== editItem.img) {
//           updatedImageUrl = await uploadImage(itemImageUri);
//         }

//         const itemRef = doc(db, `categories/${categoryId}/items`, editItem.id);
//         await updateDoc(itemRef, { name: itemName, img: updatedImageUrl });
//         fetchItemsAndRole();
//         setModalVisible(false);
//         setEditItem(null);
//         setItemName('');
//         setItemImageUri('');
//       } catch (error) {
//         console.error('Error updating item:', error);
//         Alert.alert('Error', 'There was an error updating your item.');
//       }
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={styles.container}
//       resetScrollToCoords={{ x: 0, y: 0 }}
//       contentContainerStyle={styles.container}
//       enableOnAndroid={true}
//     >
//       <View style={styles.headerContainer}>
//         {userRole === 'admin' && (
//           <Button title="+ Add New Item" onPress={() => setAddItemModalVisible(true)} />
//         )}
//       </View>
//       {items.map((item) => (
//         <View key={item.id} style={styles.itemContainer}>
//           <Image source={{ uri: item.img }} style={styles.itemImage} />
//           <View style={styles.itemDetails}>
//             <Text style={styles.itemName}>{item.name}</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity style={styles.circleButton} onPress={() => decrementQuantity(item.id, item.quantity)}>
//                 <Text style={styles.quantityButton}>-</Text>
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.quantityInput}
//                 value={String(item.quantity)}
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateQuantity(item.id, parseInt(text) || 0)}
//               />
//               <TouchableOpacity style={styles.circleButton} onPress={() => incrementQuantity(item.id, item.quantity)}>
//                 <Text style={styles.quantityButton}>+</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           {userRole === 'admin' && (
//             <Menu>
//               <MenuTrigger>
//                 <Text style={styles.menuButton}>⋮</Text>
//               </MenuTrigger>
//               <MenuOptions>
//                 <MenuOption onSelect={() => editItemDetails(item)} text="Edit " />
//                 <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" />
//               </MenuOptions>
//             </Menu>
//           )}
//         </View>
//       ))}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//           setEditItem(null);
//           setItemName('');
//           setItemImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Item Name"
//             value={itemName}
//             onChangeText={setItemName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectItemImage}>
//             <Image
//               source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             <Button title="Update Item" onPress={() => {
//               updateItem();
//               setModalVisible(false);
//               setItemName('');
//               setItemImageUri('');
//             }} />
//             <View style={styles.buttonSpacing} />
//             <Button title="Cancel" onPress={() => {
//               setModalVisible(false);
//               setEditItem(null);
//               setItemName('');
//               setItemImageUri('');
//             }} />
//           </View>
//         </View>
//       </Modal>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={addItemModalVisible}
//         onRequestClose={() => {
//           setAddItemModalVisible(!addItemModalVisible);
//           setItemName('');
//           setItemImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Item Name"
//             value={itemName}
//             onChangeText={setItemName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectItemImage}>
//             <Image
//               source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Add Item" onPress={addItem} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => {
//                   setAddItemModalVisible(false);
//                   setItemName('');
//                   setItemImageUri('');
//                 }} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//       {success && (
//         <View style={styles.successMessage}>
//           <Text style={styles.successText}>Item added successfully!</Text>
//         </View>
//       )}
//     </KeyboardAwareScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 90,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   itemImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//   },
//   itemDetails: {
//     flex: 1,
//     marginLeft: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   circleButton: {
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     padding: 10,
//     marginHorizontal: 5,
//     elevation: 3,
//   },
//   quantityButton: {
//     fontSize: 30,
//     textAlign: 'center',
//   },
//   quantityInput: {
//     fontSize: 18,
//     textAlign: 'center',
//     width: 50,
//     borderBottomWidth: 1,
//     marginHorizontal: 10,
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   successMessage: {
//     position: 'absolute',
//     top: 100, // Position it towards the top of the screen
//     left: 110,
//     transform: [{ translateX: -50 }],
//     backgroundColor: 'green',
//     padding: 20,
//     borderRadius: 10,
//     zIndex: 1, // Ensures the message is on top
//   },
//   successText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// export default CategoryDetailScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FIREBASE_AUTH } from '../config/firebase';

const CategoryDetailScreen = () => {
  const route = useRoute();
  const { categoryId, categoryName, teamName } = route.params;
  const [itemName, setItemName] = useState('');
  const [itemImageUri, setItemImageUri] = useState('');
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // To store the user's admin status
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    fetchItemsAndRole();
  }, [categoryId, categoryName, teamName]);

  const fetchItemsAndRole = async () => {
    try {
      console.log('Fetching items for categoryId:', categoryId);
      const itemsCollection = collection(db, `categories/${categoryId}/items`);
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched items:', itemsList);
      setItems(itemsList);

      // Fetch user role
      const teamsQuery = query(collection(db, 'teams'), where('name', '==', teamName));
      const teamsSnapshot = await getDocs(teamsQuery);
      if (!teamsSnapshot.empty) {
        const teamDoc = teamsSnapshot.docs[0];
        const teamData = teamDoc.data();
        const member = teamData.members.find(m => m.uid === user.uid);
        if (member) {
          console.log('User admin status:', member.admin);
          setIsAdmin(member.admin);
        } else {
          console.log('User not found in team members');
        }
      } else {
        console.log('Team document does not exist with name:', teamName);
      }
    } catch (error) {
      console.error('Error fetching items and role:', error);
    }
  };

  const selectItemImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image Picker Result:', result);
      setItemImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `items/${filename}`);
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
          console.log('Image uploaded, download URL:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  const addItem = async () => {
    if (itemName && itemImageUri) {
      setLoading(true);
      try {
        console.log('Adding item:', itemName, itemImageUri);
        const imageUrl = await uploadImage(itemImageUri);
        const newItem = {
          name: itemName,
          img: imageUrl,
          quantity: 0
        };
        const docRef = await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
        console.log('Item added with ID:', docRef.id);
        fetchItemsAndRole();
        setItemName('');
        setItemImageUri('');
        setAddItemModalVisible(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000); // Show success message for 2 seconds
      } catch (error) {
        console.error('Error adding item:', error);
        Alert.alert('Error', 'There was an error adding your item.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Missing information', 'Please provide a name and select an image.');
    }
  };

  const deleteItem = async (itemId, imgUrl) => {
    try {
      console.log('Deleting item:', itemId);
      const itemDocRef = doc(db, `categories/${categoryId}/items`, itemId);
      await deleteDoc(itemDocRef);
      const imgRef = ref(storage, imgUrl);
      await deleteObject(imgRef);
      fetchItemsAndRole();
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'There was an error deleting the item.');
    }
  };

  const incrementQuantity = async (itemId, currentQuantity) => {
    const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
    await updateDoc(itemRef, { quantity: currentQuantity + 1 });
    fetchItemsAndRole();
  };

  const decrementQuantity = async (itemId, currentQuantity) => {
    if (currentQuantity > 0) {
      const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
      await updateDoc(itemRef, { quantity: currentQuantity - 1 });
      fetchItemsAndRole();
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
    await updateDoc(itemRef, { quantity: newQuantity });
    fetchItemsAndRole();
  };

  const editItemDetails = (item) => {
    setEditItem(item);
    setItemName(item.name);
    setItemImageUri(item.img);
    setModalVisible(true);
  };
  
  const updateItem = async () => {
    if (editItem) {
      try {
        let updatedImageUrl = editItem.img;
        if (itemImageUri && itemImageUri !== editItem.img) {
          // Upload the new image
          updatedImageUrl = await uploadImage(itemImageUri);
  
          // Delete the old image
          if (editItem.img) {
            const oldImageRef = ref(storage, editItem.img);
            await deleteObject(oldImageRef);
          }
        }
  
        const itemRef = doc(db, `categories/${categoryId}/items`, editItem.id);
        await updateDoc(itemRef, { name: itemName, img: updatedImageUrl });
  
        fetchItemsAndRole();
        setModalVisible(false);
        setEditItem(null);
        setItemName('');
        setItemImageUri('');
      } catch (error) {
        console.error('Error updating item:', error);
        Alert.alert('Error', 'There was an error updating your item.');
      }
    }
  };
  
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
    >
      <View style={styles.headerContainer}>
        {isAdmin && (
          <Button title="+ Add New Item" onPress={() => setAddItemModalVisible(true)} />
        )}
      </View>
      {items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={{ uri: item.img }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.circleButton} onPress={() => decrementQuantity(item.id, item.quantity)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={String(item.quantity)}
                keyboardType="numeric"
                onChangeText={(text) => updateQuantity(item.id, parseInt(text) || 0)}
              />
              <TouchableOpacity style={styles.circleButton} onPress={() => incrementQuantity(item.id, item.quantity)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isAdmin && (
            <Menu>
              <MenuTrigger>
                <Text style={styles.menuButton}>⋮</Text>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => editItemDetails(item)} text="Edit " />
                <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" />
              </MenuOptions>
            </Menu>
          )}
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEditItem(null);
          setItemName('');
          setItemImageUri('');
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TouchableOpacity onPress={selectItemImage}>
            <Image
              source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button title="Update Item" onPress={() => {
              updateItem();
              setModalVisible(false);
              setItemName('');
              setItemImageUri('');
            }} />
            <View style={styles.buttonSpacing} />
            <Button title="Cancel" onPress={() => {
              setModalVisible(false);
              setEditItem(null);
              setItemName('');
              setItemImageUri('');
            }} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => {
          setAddItemModalVisible(!addItemModalVisible);
          setItemName('');
          setItemImageUri('');
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TouchableOpacity onPress={selectItemImage}>
            <Image
              source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Button title="Add Item" onPress={addItem} />
                <View style={styles.buttonSpacing} />
                <Button title="Cancel" onPress={() => {
                  setAddItemModalVisible(false);
                  setItemName('');
                  setItemImageUri('');
                }} />
              </>
            )}
          </View>
        </View>
      </Modal>
      {success && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Item added successfully!</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 90,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  circleButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 5,
    elevation: 3,
  },
  quantityButton: {
    fontSize: 30,
    textAlign: 'center',
  },
  quantityInput: {
    fontSize: 18,
    textAlign: 'center',
    width: 50,
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  menuButton: {
    fontSize: 30,
    padding: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSpacing: {
    width: 20,
  },
  successMessage: {
    position: 'absolute',
    top: 100, // Position it towards the top of the screen
    left: 110,
    transform: [{ translateX: -50 }],
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
    zIndex: 1, // Ensures the message is on top
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CategoryDetailScreen;
