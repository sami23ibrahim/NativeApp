

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

// const CategoryDetailScreen = () => {
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
//   const [isAdmin, setIsAdmin] = useState(false); // To store the user's admin status
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     fetchItemsAndRole();
//   }, [categoryId, categoryName, teamName]);

//   const fetchItemsAndRole = async () => {
//     try {
//       console.log('Fetching items for categoryId:', categoryId);
//       const itemsCollection = collection(db, `categories/${categoryId}/items`);
//       const itemsSnapshot = await getDocs(itemsCollection);
//       const itemsList = itemsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       console.log('Fetched items:', itemsList);
//       setItems(itemsList);

//       // Fetch user role
//       const teamsQuery = query(collection(db, 'teams'), where('name', '==', teamName));
//       const teamsSnapshot = await getDocs(teamsQuery);
//       if (!teamsSnapshot.empty) {
//         const teamDoc = teamsSnapshot.docs[0];
//         const teamData = teamDoc.data();
//         const member = teamData.members.find(m => m.uid === user.uid);
//         if (member) {
//           console.log('User admin status:', member.admin);
//           setIsAdmin(member.admin);
//         } else {
//           console.log('User not found in team members');
//         }
//       } else {
//         console.log('Team document does not exist with name:', teamName);
//       }
//     } catch (error) {
//       console.error('Error fetching items and role:', error);
//     }
//   };

//   const selectItemImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
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
//       setLoading(true); // Set loading state to true
//       try {
//         let updatedImageUrl = editItem.img;
//         if (itemImageUri && itemImageUri !== editItem.img) {
//           // Upload the new image
//           updatedImageUrl = await uploadImage(itemImageUri);

//           // Delete the old image
//           if (editItem.img) {
//             const oldImageRef = ref(storage, editItem.img);
//             await deleteObject(oldImageRef);
//           }
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
//       } finally {
//         setLoading(false); // Set loading state to false
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
//         {isAdmin && (
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
//           {isAdmin && (
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
//             editable={!loading} // Disable input while loading
//           />
//           <TouchableOpacity onPress={selectItemImage} disabled={loading}>
//             <Image
//               source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <Button title="Update Item" onPress={updateItem} />
//             )}
//             <View style={styles.buttonSpacing} />
//             <Button title="Cancel" onPress={() => {
//               setModalVisible(false);
//               setEditItem(null);
//               setItemName('');
//               setItemImageUri('');
//             }} disabled={loading} />
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
//             editable={!loading} // Disable input while loading
//           />
//           <TouchableOpacity onPress={selectItemImage} disabled={loading}>
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
//     backgroundColor: '#9cacbc',
//   },
//   headerContainer: {
//     padding: 20,
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
//     borderRadius: 20,
//     backgroundColor: 'rgba(172, 188, 198, 0.63)',    marginBottom: 10,
//     alignItems: 'center', justifyContent: 'space-between',
//     width: '95%',  alignSelf: 'center', // Center the item container
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
//       width: 0, height: 2
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

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator, FlatList, Animated } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../config/firebase';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import { FIREBASE_AUTH } from '../config/firebase';
// import SearchBar from '../components/SearchBar';

// const CategoryDetailScreen = () => {
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
//   const [isAdmin, setIsAdmin] = useState(false); // To store the user's admin status
//   const user = FIREBASE_AUTH.currentUser;
//   const flatListRef = useRef(null);
//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     fetchItemsAndRole();
//   }, [categoryId, categoryName, teamName]);

//   const fetchItemsAndRole = async () => {
//     try {
//       const itemsCollection = collection(db, `categories/${categoryId}/items`);
//       const itemsSnapshot = await getDocs(itemsCollection);
//       const itemsList = itemsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setItems(itemsList);

//       const teamsQuery = query(collection(db, 'teams'), where('name', '==', teamName));
//       const teamsSnapshot = await getDocs(teamsQuery);
//       if (!teamsSnapshot.empty) {
//         const teamDoc = teamsSnapshot.docs[0];
//         const teamData = teamDoc.data();
//         const member = teamData.members.find(m => m.uid === user.uid);
//         if (member) {
//           setIsAdmin(member.admin);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching items and role:', error);
//     }
//   };

//   const selectItemImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
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
//         (error) => reject(error),
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addItem = async () => {
//     if (itemName && itemImageUri) {
//       setLoading(true);
//       try {
//         const imageUrl = await uploadImage(itemImageUri);
//         const newItem = { name: itemName, img: imageUrl, quantity: 0 };
//         await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
//         fetchItemsAndRole();
//         setItemName('');
//         setItemImageUri('');
//         setAddItemModalVisible(false);
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 2000);
//       } catch (error) {
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
//       await deleteDoc(doc(db, `categories/${categoryId}/items`, itemId));
//       await deleteObject(ref(storage, imgUrl));
//       fetchItemsAndRole();
//     } catch (error) {
//       Alert.alert('Error', 'There was an error deleting the item.');
//     }
//   };

//   const incrementQuantity = async (itemId, currentQuantity) => {
//     await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity + 1 });
//     fetchItemsAndRole();
//   };

//   const decrementQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 0) {
//       await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity - 1 });
//       fetchItemsAndRole();
//     }
//   };

//   const updateQuantity = async (itemId, newQuantity) => {
//     await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: newQuantity });
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
//       setLoading(true);
//       try {
//         let updatedImageUrl = editItem.img;
//         if (itemImageUri && itemImageUri !== editItem.img) {
//           updatedImageUrl = await uploadImage(itemImageUri);
//           if (editItem.img) {
//             await deleteObject(ref(storage, editItem.img));
//           }
//         }

//         await updateDoc(doc(db, `categories/${categoryId}/items`, editItem.id), { name: itemName, img: updatedImageUrl });

//         fetchItemsAndRole();
//         setModalVisible(false);
//         setEditItem(null);
//         setItemName('');
//         setItemImageUri('');
//       } catch (error) {
//         Alert.alert('Error', 'There was an error updating your item.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleItemSelect = (selectedItem) => {
//     const index = items.findIndex(item => item.id === selectedItem.id);
//     if (flatListRef.current && index >= 0) {
//       flatListRef.current.scrollToIndex({ index });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.FlatList
//         ref={flatListRef}
//         data={items}
//         keyExtractor={item => item.id}
//         ListHeaderComponent={
//           <Animated.View style={{
//             transform: [{
//               translateY: scrollY.interpolate({
//                 inputRange: [0, 50],
//                 outputRange: [0, -50],
//                 extrapolate: 'clamp',
//               })
//             }],
//           }}>
//             <View style={styles.headerContainer}>
//               {isAdmin && (
//                 <Button title="+ Add New Item" onPress={() => setAddItemModalVisible(true)} />
//               )}
//             </View>
//             <SearchBar items={items} onSelect={handleItemSelect} />
//           </Animated.View>
//         }
//         renderItem={({ item }) => (
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
//             {isAdmin && (
//               <Menu>
//                 <MenuTrigger>
//                   <Text style={styles.menuButton}>⋮</Text>
//                 </MenuTrigger>
//                 <MenuOptions>
//                   <MenuOption onSelect={() => editItemDetails(item)} text="Edit " />
//                   <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" />
//                 </MenuOptions>
//               </Menu>
//             )}
//           </View>
//         )}
//         ListFooterComponent={
//           <>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => {
//                 setModalVisible(!modalVisible);
//                 setEditItem(null);
//                 setItemName('');
//                 setItemImageUri('');
//               }}
//             >
//               <View style={styles.modalView}>
//                 <TextInput
//                   placeholder="Item Name"
//                   value={itemName}
//                   onChangeText={setItemName}
//                   style={styles.input}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity onPress={selectItemImage} disabled={loading}>
//                   <Image
//                     source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                     style={styles.image}
//                   />
//                 </TouchableOpacity>
//                 <View style={styles.buttonContainer}>
//                   {loading ? (
//                     <ActivityIndicator size="large" color="#0000ff" />
//                   ) : (
//                     <Button title="Update Item" onPress={updateItem} />
//                   )}
//                   <View style={styles.buttonSpacing} />
//                   <Button title="Cancel" onPress={() => {
//                     setModalVisible(false);
//                     setEditItem(null);
//                     setItemName('');
//                     setItemImageUri('');
//                   }} disabled={loading} />
//                 </View>
//               </View>
//             </Modal>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={addItemModalVisible}
//               onRequestClose={() => {
//                 setAddItemModalVisible(!addItemModalVisible);
//                 setItemName('');
//                 setItemImageUri('');
//               }}
//             >
//               <View style={styles.modalView}>
//                 <TextInput
//                   placeholder="Item Name"
//                   value={itemName}
//                   onChangeText={setItemName}
//                   style={styles.input}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity onPress={selectItemImage} disabled={loading}>
//                   <Image
//                     source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                     style={styles.image}
//                   />
//                 </TouchableOpacity>
//                 <View style={styles.buttonContainer}>
//                   {loading ? (
//                     <ActivityIndicator size="large" color="#0000ff" />
//                   ) : (
//                     <>
//                       <Button title="Add Item" onPress={addItem} />
//                       <View style={styles.buttonSpacing} />
//                       <Button title="Cancel" onPress={() => {
//                         setAddItemModalVisible(false);
//                         setItemName('');
//                         setItemImageUri('');
//                       }} />
//                     </>
//                   )}
//                 </View>
//               </View>
//             </Modal>
//             {success && (
//               <View style={styles.successMessage}>
//                 <Text style={styles.successText}>Item added successfully!</Text>
//               </View>
//             )}
//           </>
//         }
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#9cacbc',
//   },
//   headerContainer: {
//     padding: 20,
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
//     borderRadius: 20,
//     backgroundColor: 'rgba(172, 188, 198, 0.63)',    
//     marginBottom: 10,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center', 
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
//       width: 0, height: 2
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
//     top: 100,
//     left: 110,
//     transform: [{ translateX: -50 }],
//     backgroundColor: 'green',
//     padding: 20,
//     borderRadius: 10,
//     zIndex: 1,
//   },
//   successText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// export default CategoryDetailScreen;
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator, Keyboard, Animated, FlatList } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { db, storage } from '../config/firebase';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// import { FIREBASE_AUTH } from '../config/firebase';
// import SearchBar from '../components/SearchBar';

// //const HEADER_HEIGHT = 30.99;
// const HEADER_HEIGHT = 92;

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// const Spacer = ({ height }) => {
//   return <View style={{ height }} />;
// };
// const CategoryDetailScreen = () => {
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
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const user = FIREBASE_AUTH.currentUser;
//   const flatListRef = useRef(null);
//   const searchBarRef = useRef(null);
//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     fetchItemsAndRole();
//   }, [categoryId, categoryName, teamName]);

//   const fetchItemsAndRole = async () => {
//     try {
//       const itemsCollection = collection(db, `categories/${categoryId}/items`);
//       const itemsSnapshot = await getDocs(itemsCollection);
//       const itemsList = itemsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setItems(itemsList);

//       const teamsQuery = query(collection(db, 'teams'), where('name', '==', teamName));
//       const teamsSnapshot = await getDocs(teamsQuery);
//       if (!teamsSnapshot.empty) {
//         const teamDoc = teamsSnapshot.docs[0];
//         const teamData = teamDoc.data();
//         const member = teamData.members.find(m => m.uid === user.uid);
//         if (member) {
//           setIsAdmin(member.admin);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching items and role:', error);
//     }
//   };

//   const selectItemImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
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
//         (error) => reject(error),
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addItem = async () => {
//     if (itemName && itemImageUri) {
//       setLoading(true);
//       try {
//         const imageUrl = await uploadImage(itemImageUri);
//         const newItem = { name: itemName, img: imageUrl, quantity: 0 };
//         await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
//         fetchItemsAndRole();
//         setItemName('');
//         setItemImageUri('');
//         setAddItemModalVisible(false);
//         setSuccess(true);
//         setTimeout(() => setSuccess(false),1000);
//       } catch (error) {
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
//       await deleteDoc(doc(db, `categories/${categoryId}/items`, itemId));
//       await deleteObject(ref(storage, imgUrl));
//       fetchItemsAndRole();
//     } catch (error) {
//       Alert.alert('Error', 'There was an error deleting the item.');
//     }
//   };

//   const incrementQuantity = async (itemId, currentQuantity) => {
//     await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity + 1 });
//     fetchItemsAndRole();
//   };

//   const decrementQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 0) {
//       await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity - 1 });
//       fetchItemsAndRole();
//     }
//   };

//   const updateQuantity = async (itemId, newQuantity) => {
//     await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: newQuantity });
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
//       setLoading(true);
//       try {
//         let updatedImageUrl = editItem.img;
//         if (itemImageUri && itemImageUri !== editItem.img) {
//           updatedImageUrl = await uploadImage(itemImageUri);
//           if (editItem.img) {
//             await deleteObject(ref(storage, editItem.img));
//           }
//         }

//         await updateDoc(doc(db, `categories/${categoryId}/items`, editItem.id), { name: itemName, img: updatedImageUrl });

//         fetchItemsAndRole();
//         setModalVisible(false);
//         setEditItem(null);
//         setItemName('');
//         setItemImageUri('');
//       } catch (error) {
//         Alert.alert('Error', 'There was an error updating your item.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleItemSelect = (selectedItem) => {
//     const index = items.findIndex(item => item.id === selectedItem.id);
//     if (flatListRef.current && index >= 0) {
//       flatListRef.current.scrollToIndex({ index });
//     }
//   };

//   const handleScroll = () => {
//     searchBarRef.current?.clearInput(); // Clear search bar input text
//     Keyboard.dismiss(); // Close the keyboard when scrolling
//   };

//   const headerTranslateY = scrollY.interpolate({
//     inputRange: [0, HEADER_HEIGHT],
//     outputRange: [0, -HEADER_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
//         <Text style={styles.categoryName}>{categoryName}</Text>
//         {items.length > 0 && <SearchBar ref={searchBarRef} items={items} onSelect={handleItemSelect} />}
//       </Animated.View>
//       <Spacer height={80} /> 
//       {items.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.emptyImage} />
//         </View>
//       ) : (
//         <AnimatedFlatList
//           ref={flatListRef}
//           data={items}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <View key={item.id} style={styles.itemContainer}>
//               <Image source={{ uri: item.img }} style={styles.itemImage} />
//               <View style={styles.itemDetails}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <View style={styles.quantityContainer}>
//                   <TouchableOpacity style={styles.circleButton} onPress={() => decrementQuantity(item.id, item.quantity)}>
//                     <Text style={styles.quantityButton}>-</Text>
//                   </TouchableOpacity>
//                   <TextInput
//                     style={styles.quantityInput}
//                     value={String(item.quantity)}
//                     keyboardType="numeric"
//                     onChangeText={(text) => updateQuantity(item.id, parseInt(text) || 0)}
//                   />
//                   <TouchableOpacity style={styles.circleButton} onPress={() => incrementQuantity(item.id, item.quantity)}>
//                     <Text style={styles.quantityButton}>+</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               {isAdmin && (
//                 <Menu>
//                   <MenuTrigger>
//                     <Text style={styles.menuButton}>⋮</Text>
//                   </MenuTrigger>
//                   <MenuOptions>
//                     <MenuOption onSelect={() => editItemDetails(item)} text="Edit " />
//                     <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" />
//                   </MenuOptions>
//                 </Menu>
//               )}
//             </View>
//           )}
//           ListFooterComponent={
//             <>
//               <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => {
//                   setModalVisible(!modalVisible);
//                   setEditItem(null);
//                   setItemName('');
//                   setItemImageUri('');
//                 }}
//               >
//                 <View style={styles.modalView}>
//                   <TextInput
//                     placeholder="Item Name"
//                     value={itemName}
//                     onChangeText={setItemName}
//                     style={styles.input}
//                     editable={!loading}
//                   />
//                   <TouchableOpacity onPress={selectItemImage} disabled={loading}>
//                     <Image
//                       source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                       style={styles.image}
//                     />
//                   </TouchableOpacity>
//                   <View style={styles.buttonContainer}>
//                     {loading ? (
//                       <ActivityIndicator size="large" color="#0000ff" />
//                     ) : (
//                       <Button title="Update Item" onPress={updateItem} />
//                     )}
//                     <View style={styles.buttonSpacing} />
//                     <Button title="Cancel" onPress={() => {
//                       setModalVisible(false);
//                       setEditItem(null);
//                       setItemName('');
//                       setItemImageUri('');
//                     }} disabled={loading} />
//                   </View>
//                 </View>
//               </Modal>
//               <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={addItemModalVisible}
//                 onRequestClose={() => {
//                   setAddItemModalVisible(!addItemModalVisible);
//                   setItemName('');
//                   setItemImageUri('');
//                 }}
//               >
//                 <View style={styles.modalView}>
//                   <TextInput
//                     placeholder="Item Name"
//                     value={itemName}
//                     onChangeText={setItemName}
//                     style={styles.input}
//                     editable={!loading}
//                   />
//                   <TouchableOpacity onPress={selectItemImage} disabled={loading}>
//                     <Image
//                       source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
//                       style={styles.image}
//                     />
//                   </TouchableOpacity>
//                   <View style={styles.buttonContainer}>
//                     {loading ? (
//                       <ActivityIndicator size="large" color="#0000ff" />
//                     ) : (
//                       <>
//                         <Button title="Add Item" onPress={addItem} />
//                         <View style={styles.buttonSpacing} />
//                         <Button title="Cancel" onPress={() => {
//                           setAddItemModalVisible(false);
//                           setItemName('');
//                           setItemImageUri('');
//                         }} />
//                       </>
//                     )}
//                   </View>
//                 </View>
//               </Modal>
//               {success && (
//                 <View style={styles.successMessage}>
//                   <Text style={styles.successText}>Item added successfully!</Text>
//                 </View>
//               )}
//             </>
//           }
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: true, listener: handleScroll }
//           )}
//           contentContainerStyle={{ paddingTop: HEADER_HEIGHT }} // Adjust padding based on header height
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#9cacbc',
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2,
//     backgroundColor: '#9cacbc',
//     paddingBottom: 51,
//     alignItems: 'center',
//     height: HEADER_HEIGHT,
//     paddingTop: 40,
//   },
//   categoryName: {
//     fontSize: 35,
//     zIndex: 1,
//     height: 53,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     color: 'white'
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 90,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(172, 188, 198, 0.63)',
//     marginBottom: 10,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '95%',
//     alignSelf: 'center',
//   },
//   itemImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 10,
//   },
//   itemDetails: {
//     flex: 1,
//     marginLeft: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: 'white'
//   },
//   itemName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     padding: 11,
//     textAlign: 'center',
//     color: 'white'
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   circleButton: {
//     backgroundColor: '#9cacbc',
//     borderRadius: 90,
//     padding: 10,
//     marginHorizontal: 5,
//     elevation: 4,
//   },
//   quantityButton: {
//     fontSize: 23,
//     textAlign: 'center',
//     color: 'white',
//     marginHorizontal: 11,
//     elevation: 4,
//   },
//   quantityInput: {
//     fontSize: 22,
//     textAlign: 'center',
//     width: 40,
//     borderBottomWidth: 0,
//     marginHorizontal: 14,
//     color: 'white'
//   },
//   menuButton: {
//     fontSize: 30,
//     padding: 10,
//     color: 'white',
//     marginBottom: 53,
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
//     top: 100,
//     left: 110,
//     transform: [{ translateX: -50 }],
//     backgroundColor: 'green',
//     padding: 20,
//     borderRadius: 10,
//     zIndex: 1,
//   },
//   successText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyImage: {
//     width: 300,
//     height: 300,
//   },
// });




import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator, Keyboard, Animated, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FIREBASE_AUTH } from '../config/firebase';
import SearchBar from '../components/SearchBar';

const HEADER_HEIGHT = 92;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const Spacer = ({ height }) => {
  return <View style={{ height }} />;
};

const CategoryDetailScreen = () => {
  const route = useRoute();
  const { categoryId, categoryName, teamName } = route.params;
  const [itemName, setItemName] = useState('');
  const [itemImageUri, setItemImageUri] = useState(null);
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const user = FIREBASE_AUTH.currentUser;
  const flatListRef = useRef(null);
  const searchBarRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchItemsAndRole();
  }, [categoryId, categoryName, teamName]);

  const fetchItemsAndRole = async () => {
    try {
      const itemsCollection = collection(db, `categories/${categoryId}/items`);
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);

      const teamsQuery = query(collection(db, 'teams'), where('name', '==', teamName));
      const teamsSnapshot = await getDocs(teamsQuery);
      if (!teamsSnapshot.empty) {
        const teamDoc = teamsSnapshot.docs[0];
        const teamData = teamDoc.data();
        const member = teamData.members.find(m => m.uid === user.uid);
        if (member) {
          setIsAdmin(member.admin);
          console.log('User role:', member.admin ? 'Admin' : 'Member'); // Debug statement
        }
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
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const addItem = async () => {
    console.log("addItem called with itemName:", itemName, "itemImageUri:", itemImageUri);
    if (itemName && itemImageUri) {
      setLoading(true);
      try {
        const imageUrl = await uploadImage(itemImageUri);
        const newItem = { name: itemName, img: imageUrl, quantity: 0 };
        await addDoc(collection(db, `categories/${categoryId}/items`), newItem);
        fetchItemsAndRole();
        setItemName('');
        setItemImageUri('');
        setAddItemModalVisible(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1000);
      } catch (error) {
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
      await deleteDoc(doc(db, `categories/${categoryId}/items`, itemId));
      await deleteObject(ref(storage, imgUrl));
      fetchItemsAndRole();
    } catch (error) {
      Alert.alert('Error', 'There was an error deleting the item.');
    }
  };

  const incrementQuantity = async (itemId, currentQuantity) => {
    await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity + 1 });
    fetchItemsAndRole();
  };

  const decrementQuantity = async (itemId, currentQuantity) => {
    if (currentQuantity > 0) {
      await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: currentQuantity - 1 });
      fetchItemsAndRole();
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    await updateDoc(doc(db, `categories/${categoryId}/items`, itemId), { quantity: newQuantity });
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
      setLoading(true);
      try {
        let updatedImageUrl = editItem.img;
        if (itemImageUri && itemImageUri !== editItem.img) {
          updatedImageUrl = await uploadImage(itemImageUri);
          if (editItem.img) {
            await deleteObject(ref(storage, editItem.img));
          }
        }

        await updateDoc(doc(db, `categories/${categoryId}/items`, editItem.id), { name: itemName, img: updatedImageUrl });

        fetchItemsAndRole();
        setModalVisible(false);
        setEditItem(null);
        setItemName('');
        setItemImageUri('');
      } catch (error) {
        Alert.alert('Error', 'There was an error updating your item.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleItemSelect = (selectedItem) => {
    const index = items.findIndex(item => item.id === selectedItem.id);
    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToIndex({ index });
    }
  };

  const handleScroll = () => {
    searchBarRef.current?.clearInput(); // Clear search bar input text
    Keyboard.dismiss(); // Close the keyboard when scrolling
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <Text style={styles.categoryName}>{categoryName}</Text>
        {items.length > 0 && <SearchBar ref={searchBarRef} items={items} onSelect={handleItemSelect} />}
      </Animated.View>
      <Spacer height={80} />
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noCategories}>
            This category has no items yet. {' '}
            {isAdmin ? (
              <Text style={styles.noCategories}>Add some items to start organizing your inventory!</Text>
            ) : (
              <Text style={styles.noCategories}>New items will appear here when added!</Text>
            )}
          </Text>
          <Image source={require('../../assets/box2.png')} style={styles.emptyImage} />
        </View>
      ) : null}
      <AnimatedFlatList
        ref={flatListRef}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image source={{ uri: item.img }} style={[styles.itemImage, { borderRadius: 10 }]} />
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
                <TouchableOpacity style={styles.circleButtonPlus} onPress={() => incrementQuantity(item.id, item.quantity)}>
                  <Text style={styles.quantityButtonPlus}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {isAdmin && (
              <Menu>
                <MenuTrigger>
                  <Text style={styles.menuButton}>⋮</Text>
                </MenuTrigger>
                <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
                  <MenuOption onSelect={() => editItemDetails(item)} text="Edit" customStyles={{ optionText: styles.optionText }} />
                  <MenuOption onSelect={() => deleteItem(item.id, item.img)} text="Delete" customStyles={{ optionText: styles.optionText }} />
                </MenuOptions>
              </Menu>
            )}
          </View>
        )}
        ListFooterComponent={
          <>
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
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TextInput
                    placeholder="Item Name"
                    value={itemName}
                    onChangeText={setItemName}
                    style={styles.input}
                    editable={!loading}
                    placeholderTextColor="white"
                  />
                  <TouchableOpacity onPress={selectItemImage} disabled={loading}>
                    <Image
                      source={{ uri: itemImageUri || 'https://via.placeholder.com/150' }}
                      style={[styles.image, { borderRadius: 20 }]}
                    />
                  </TouchableOpacity>
                  <View style={styles.buttonContainer}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <>
                        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={updateItem}>
                          <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonSpacing} />
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {
                          setModalVisible(false);
                          setEditItem(null);
                          setItemName('');
                          setItemImageUri('');
                        }} disabled={loading}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={addItemModalVisible}
              onRequestClose={() => {
                console.log("Closing add item modal");
                setAddItemModalVisible(!addItemModalVisible);
                setItemName('');
                setItemImageUri('');
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TextInput
                    placeholder="Item Name"
                    value={itemName}
                    onChangeText={setItemName}
                    style={styles.input}
                    editable={!loading}
                    placeholderTextColor="white"
                  />
                  <TouchableOpacity onPress={selectItemImage} disabled={loading}>
                    <Image
                      source={itemImageUri ? { uri: itemImageUri } : require('../../assets/addImg.png')}
                      style={[styles.image, { borderRadius: 20 }]}
                    />
                  </TouchableOpacity>
                  <View style={styles.buttonContainer}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addItem}>
                          <Text style={styles.buttonText}>Add Item</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonSpacing} />
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {
                          setAddItemModalVisible(false);
                          setItemName('');
                          setItemImageUri('');
                        }}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
            {success && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>Item added successfully!</Text>
              </View>
            )}
          </>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScroll }
        )}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      />
      {isAdmin && (
        <TouchableOpacity style={styles.floatingAddButton} onPress={() => {
          setAddItemModalVisible(true);
        }}>
          <Text style={styles.floatingAddButtonText}>Add Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9cacbc',
  },

  optionsContainer: {
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Your desired background color
    padding: 5,
    borderRadius: 10,
  },
  optionText: {
    color: 'white', // Your desired text color
    fontSize: 18,
  },
  noCategories: {
    fontSize: 28,marginTop: 120,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 55,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  emptyImage: {
    width: 330,
    height: 200,
    marginTop: 20,marginButtom: 90,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: '#9cacbc',
    paddingBottom: 51,
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingTop: 40,
  },
  categoryName: {
    fontSize: 35,
    zIndex: 1,
    height: 53,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.4,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 200,color: 'white',
  },
  image: {
    width: 123,
    height: 115,
    marginBottom: 20,
    borderRadius:10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(172, 188, 198, 0.63)',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 11,
    textAlign: 'center',
    color: 'white'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  circleButtonPlus: {
    backgroundColor: '#9cacbc',
    borderRadius:15,
    padding: 10,
    marginHorizontal: 5,
    elevation: 4,height:47,width:53,
  },
  circleButton: {
    backgroundColor: '#9cacbc',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    elevation: 4,height:49,width:51,
  },
  quantityButton: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 11,
    elevation: 4,
  },
  quantityButtonPlus: {
    fontSize: 21,
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 11,
    elevation: 4,
  },
  quantityInput: {
    fontSize: 22,
    textAlign: 'center',
    width: 40,
    borderBottomWidth: 0,
    marginHorizontal: 14,
    color: 'white'
  },
  menuButton: {
    fontSize: 30,
    padding: 10,
    color: 'white',
    marginBottom: 53,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(172, 188, 198, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  buttonSpacing: {
    width: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width:'85%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  updateButton: {
    width:'85%',
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  cancelButton: {
    width:'85%',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    position: 'absolute',
    top: 100,
    left: 110,
    transform: [{ translateX: -50 }],
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

 
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9cacbc',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  floatingAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoryDetailScreen;
