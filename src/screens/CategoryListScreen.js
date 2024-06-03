
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation } from '@react-navigation/native';

// const CategoryListScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();
//   const numColumns = 2; // Number of columns

//   const fetchCategories = async () => {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `images/${filename}`);
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
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addCategory = async () => {
//     if (categoryName && imageUri) {
//       setLoading(true);
//       try {
//         const imageUrl = await uploadImage(imageUri);
//         await addDoc(collection(db, 'categories'), {
//           name: categoryName,
//           img: imageUrl,
//         });
//         Alert.alert('Category added!', 'Your category has been added successfully.');
//         setCategoryName('');
//         setImageUri('');
//         setModalVisible(false);
//         fetchCategories();
//       } catch (error) {
//         console.error('Error adding category: ', error);
//         Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const navigateToCategoryDetail = (categoryId) => {
//     navigation.navigate('My Categories', { categoryId });
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns; // Adjust for padding/margin

//     if (item.addNew) {
//       return (
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <TouchableOpacity onPress={() => navigateToCategoryDetail(item.id)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <Image source={{ uri: item.img }} style={styles.categoryImage} />
//         <Text style={styles.categoryName}>{item.name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[{ addNew: true }, ...categories]}
//         keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//         renderItem={renderCategoryItem}
//         numColumns={numColumns}
//         contentContainerStyle={styles.list}
//       />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//           setCategoryName('');
//           setImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Category Name"
//             value={categoryName}
//             onChangeText={setCategoryName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectImage}>
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Add Category" onPress={addCategory} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => {
//                   setModalVisible(false);
//                   setCategoryName('');
//                   setImageUri('');
//                 }} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
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
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
// });

// export default CategoryListScreen;







// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons'; // Import icons from expo/vector-icons

// const CategoryListScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const navigation = useNavigation();
//   const numColumns = 2; // Number of columns

//   const fetchCategories = async () => {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `images/${filename}`);
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
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addCategory = async () => {
//     if (categoryName && imageUri) {
//       setLoading(true);
//       try {
//         const imageUrl = await uploadImage(imageUri);
//         await addDoc(collection(db, 'categories'), {
//           name: categoryName,
//           img: imageUrl,
//         });
//         Alert.alert('Category added!', 'Your category has been added successfully.');
//         setCategoryName('');
//         setImageUri('');
//         setModalVisible(false);
//         fetchCategories();
//       } catch (error) {
//         console.error('Error adding category: ', error);
//         Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const navigateToCategoryDetail = (categoryId) => {
//     navigation.navigate('My Categories', { categoryId });
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       await deleteDoc(doc(db, 'categories', categoryId));
//       Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category: ', error);
//       Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
//     }
//   };

//   const openMenu = (categoryId) => {
//     setSelectedCategoryId(categoryId);
//     setMenuVisible(true);
//   };

//   const closeMenu = () => {
//     setSelectedCategoryId(null);
//     setMenuVisible(false);
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns; // Adjust for padding/margin

//     if (item.addNew) {
//       return (
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigateToCategoryDetail(item.id)} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => openMenu(item.id)} style={styles.menuButton}>
//           <MaterialIcons name="more-vert" size={24} color="black" />
//         </TouchableOpacity>
//         {menuVisible && selectedCategoryId === item.id && (
//           <TouchableWithoutFeedback onPress={closeMenu}>
//             <View style={styles.menu}>
//               <TouchableOpacity onPress={() => Alert.alert('Edit Category', 'Edit functionality coming soon')}>
//                 <Text style={styles.menuItem}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => deleteCategory(item.id)}>
//                 <Text style={styles.menuItem}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[{ addNew: true }, ...categories]}
//         keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//         renderItem={renderCategoryItem}
//         numColumns={numColumns}
//         contentContainerStyle={styles.list}
//       />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//           setCategoryName('');
//           setImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Category Name"
//             value={categoryName}
//             onChangeText={setCategoryName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectImage}>
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Add Category" onPress={addCategory} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => {
//                   setModalVisible(false);
//                   setCategoryName('');
//                   setImageUri('');
//                 }} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 30,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 14,
//     right: 10,backgroundColor: 'transparent', elevation: 35,
//   },
//   menu: {
//     position: 'absolute',
//     top: 30,
//     right: 30,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 5,
//     elevation: 15,
//     padding: 20,
//     zIndex: 100,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//   },
// });

// export default CategoryListScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons'; // Import icons from expo/vector-icons

// const CategoryListScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const navigation = useNavigation();
//   const numColumns = 2; // Number of columns

//   const fetchCategories = async () => {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = ref(storage, `images/${filename}`);
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
//           resolve(downloadURL);
//         }
//       );
//     });
//   };

//   const addCategory = async () => {
//     if (categoryName && imageUri) {
//       setLoading(true);
//       try {
//         const imageUrl = await uploadImage(imageUri);
//         await addDoc(collection(db, 'categories'), {
//           name: categoryName,
//           img: imageUrl,
//         });
//         Alert.alert('Category added!', 'Your category has been added successfully.');
//         setCategoryName('');
//         setImageUri('');
//         setModalVisible(false);
//         fetchCategories();
//       } catch (error) {
//         console.error('Error adding category: ', error);
//         Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const editCategory = async () => {
//     if (selectedCategory.name && selectedCategory.img) {
//       setLoading(true);
//       try {
//         const imageUrl = selectedCategory.img !== imageUri ? await uploadImage(imageUri) : selectedCategory.img;
//         await updateDoc(doc(db, 'categories', selectedCategoryId), {
//           name: selectedCategory.name,
//           img: imageUrl,
//         });
//         Alert.alert('Category updated!', 'Your category has been updated successfully.');
//         setSelectedCategory(null);
//         setImageUri('');
//         setEditModalVisible(false);
//         fetchCategories();
//       } catch (error) {
//         console.error('Error updating category: ', error);
//         Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//     }
//   };

//   const navigateToCategoryDetail = (categoryId) => {
//     navigation.navigate('My Categories', { categoryId });
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       await deleteDoc(doc(db, 'categories', categoryId));
//       Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category: ', error);
//       Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
//     }
//   };

//   const openMenu = (categoryId) => {
//     setSelectedCategoryId(categoryId);
//     setMenuVisible(true);
//   };

//   const closeMenu = () => {
//     setSelectedCategoryId(null);
//     setMenuVisible(false);
//   };

//   const openEditModal = (category) => {
//     setSelectedCategory(category);
//     setImageUri(category.img);
//     setEditModalVisible(true);
//     closeMenu();
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns; // Adjust for padding/margin

//     if (item.addNew) {
//       return (
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigateToCategoryDetail(item.id)} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => openMenu(item.id)} style={styles.menuButton}>
//           <MaterialIcons name="more-vert" size={30} color="black" />
//         </TouchableOpacity>
//         {menuVisible && selectedCategoryId === item.id && (
//           <TouchableWithoutFeedback onPress={closeMenu}>
//             <View style={styles.menu}>
//               <TouchableOpacity onPress={() => openEditModal(item)}>
//                 <Text style={styles.menuItem}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => deleteCategory(item.id)}>
//                 <Text style={styles.menuItem}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[{ addNew: true }, ...categories]}
//         keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//         renderItem={renderCategoryItem}
//         numColumns={numColumns}
//         contentContainerStyle={styles.list}
//       />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//           setCategoryName('');
//           setImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Category Name"
//             value={categoryName}
//             onChangeText={setCategoryName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectImage}>
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Add Category" onPress={addCategory} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => {
//                   setModalVisible(false);
//                   setCategoryName('');
//                   setImageUri('');
//                 }} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={editModalVisible}
//         onRequestClose={() => {
//           setEditModalVisible(!editModalVisible);
//           setSelectedCategory(null);
//           setImageUri('');
//         }}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Category Name"
//             value={selectedCategory ? selectedCategory.name : ''}
//             onChangeText={(text) => setSelectedCategory({ ...selectedCategory, name: text })}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectImage}>
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title="Edit Category" onPress={editCategory} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => {
//                   setEditModalVisible(false);
//                   setSelectedCategory(null);
//                   setImageUri('');
//                 }} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   menu: {
//     position: 'absolute',
//     top: 30,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//     elevation: 5,
//     padding: 10,
//     zIndex: 100,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//   },
// });

// export default CategoryListScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';

// const CategoryListScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const navigation = useNavigation();
//   const numColumns = 2;

//   const fetchCategories = async () => {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const filename = uri.substring(uri.lastIndexOf('/') + 1);
//       const storageRef = ref(storage, `images/${filename}`);
//       const uploadTask = uploadBytesResumable(storageRef, blob);

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           'state_changed',
//           null,
//           (error) => {
//             console.error('Upload failed', error);
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             console.log('Image uploaded successfully:', downloadURL);
//             resolve(downloadURL);
//           }
//         );
//       });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   };

//   const addCategory = async () => {
//     if (!categoryName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       await addDoc(collection(db, 'categories'), {
//         name: categoryName,
//         img: imageUrl,
//       });
//       Alert.alert('Category added!', 'Your category has been added successfully.');
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error adding category:', error);
//       Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editCategory = async () => {
//     if (!selectedCategory || !categoryName.trim()) {
//       Alert.alert('Missing information', 'Please provide a name.');
//       return;
//     }

//     setLoading(true);
//     try {
//       let imageUrl = selectedCategory.img;
//       if (imageUri && imageUri !== selectedCategory.img) {
//         imageUrl = await uploadImage(imageUri);
//       }
//       await updateDoc(doc(db, 'categories', selectedCategory.id), {
//         name: categoryName,
//         img: imageUrl,
//       });
//       Alert.alert('Category updated!', 'Your category has been updated successfully.');
//       setSelectedCategory(null);
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error updating category:', error);
//       Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       await deleteDoc(doc(db, 'categories', categoryId));
//       Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
//     }
//   };

//   const openModal = (category) => {
//     if (category) {
//       setSelectedCategory(category);
//       setCategoryName(category.name);
//       setImageUri(category.img);
//     } else {
//       setSelectedCategory(null);
//       setCategoryName('');
//       setImageUri('');
//     }
//     setModalVisible(true);
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns;

//     if (item.addNew) {
//       return (
//         <TouchableOpacity onPress={() => openModal(null)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('My Categories', { categoryId: item.id })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => openModal(item)} style={styles.menuButton}>
//           <MaterialIcons name="more-vert" size={30} color="black" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[{ addNew: true }, ...categories]}
//         keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//         renderItem={renderCategoryItem}
//         numColumns={numColumns}
//         contentContainerStyle={styles.list}
//       />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <TextInput
//             placeholder="Category Name"
//             value={categoryName}
//             onChangeText={setCategoryName}
//             style={styles.input}
//           />
//           <TouchableOpacity onPress={selectImage}>
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.image}
//             />
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <>
//                 <Button title={selectedCategory ? "Edit Category" : "Add Category"} onPress={selectedCategory ? editCategory : addCategory} />
//                 <View style={styles.buttonSpacing} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
// });

// export default CategoryListScreen;








// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';

// const CategoryListScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuCategory, setMenuCategory] = useState(null);
//   const navigation = useNavigation();
//   const numColumns = 2;

//   const fetchCategories = async () => {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const filename = uri.substring(uri.lastIndexOf('/') + 1);
//       const storageRef = ref(storage, `images/${filename}`);
//       const uploadTask = uploadBytesResumable(storageRef, blob);

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           'state_changed',
//           null,
//           (error) => {
//             console.error('Upload failed', error);
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             console.log('Image uploaded successfully:', downloadURL);
//             resolve(downloadURL);
//           }
//         );
//       });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   };

//   const addCategory = async () => {
//     if (!categoryName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       await addDoc(collection(db, 'categories'), {
//         name: categoryName,
//         img: imageUrl,
//       });
//       Alert.alert('Category added!', 'Your category has been added successfully.');
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error adding category:', error);
//       Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editCategory = async () => {
//     if (!selectedCategory || !categoryName.trim()) {
//       Alert.alert('Missing information', 'Please provide a name.');
//       return;
//     }

//     setLoading(true);
//     try {
//       let imageUrl = selectedCategory.img;
//       if (imageUri && imageUri !== selectedCategory.img) {
//         imageUrl = await uploadImage(imageUri);
//       }
//       await updateDoc(doc(db, 'categories', selectedCategory.id), {
//         name: categoryName,
//         img: imageUrl,
//       });
//       Alert.alert('Category updated!', 'Your category has been updated successfully.');
//       setSelectedCategory(null);
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error updating category:', error);
//       Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       await deleteDoc(doc(db, 'categories', categoryId));
//       Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
//     }
//   };

//   const openMenu = (category) => {
//     setMenuCategory(category);
//     setMenuVisible(true);
//   };

//   const closeMenu = () => {
//     setMenuCategory(null);
//     setMenuVisible(false);
//   };

//   const openEditModal = (category) => {
//     setSelectedCategory(category);
//     setCategoryName(category.name);
//     setImageUri(category.img);
//     setModalVisible(true);
//     closeMenu();
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns;

//     if (item.addNew) {
//       return (
//         <TouchableOpacity
//           onPress={() => {
//             setSelectedCategory(null);
//             setCategoryName('');
//             setImageUri('');
//             setModalVisible(true);
//           }}
//           style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}
//         >
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('My Categories', { categoryId: item.id })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
//           <MaterialIcons name="more-vert" size={30} color="black" />
//         </TouchableOpacity>
//         {menuVisible && menuCategory && menuCategory.id === item.id && (
//           <View style={styles.menuContainer}>
//             <TouchableOpacity onPress={() => openEditModal(item)}>
//               <Text style={styles.menuItem}>Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => deleteCategory(item.id)}>
//               <Text style={styles.menuItem}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <TouchableWithoutFeedback onPress={closeMenu}>
//       <View style={styles.container}>
//         <FlatList
//           data={[{ addNew: true }, ...categories]}
//           keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//           renderItem={renderCategoryItem}
//           numColumns={numColumns}
//           contentContainerStyle={styles.list}
//         />
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalView}>
//             <TextInput
//               placeholder="Category Name"
//               value={categoryName}
//               onChangeText={setCategoryName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//               ) : (
//                 <>
//                   <Button title={selectedCategory ? "Edit Category" : "Add Category"} onPress={selectedCategory ? editCategory : addCategory} />
//                   <View style={styles.buttonSpacing} />
//                   <Button title="Cancel" onPress={() => setModalVisible(false)} />
//                 </>
//               )}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 40,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//     elevation: 5,
//     padding: 10,
//     zIndex: 2,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//   },
// });

// export default CategoryListScreen;






// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';

// const CategoryListScreen = ({ navigation }) => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuCategory, setMenuCategory] = useState(null);
//   const route = useRoute();
//   const { teamId, teamName } = route.params; // Get teamId and teamName from route params
//   const numColumns = 2;

//   useEffect(() => {
//     navigation.setOptions({ title:'Team "' + teamName+'"' }); // Set the header title to the team name
//     fetchCategories();
//   }, [teamId, teamName]); // Add teamName to the dependency array

//   const fetchCategories = async () => {
//     const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
//     const querySnapshot = await getDocs(q);
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);
//   };

//   const selectImage = async () => {
//     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const filename = uri.substring(uri.lastIndexOf('/') + 1);
//       const storageRef = ref(storage, `images/${filename}`);
//       const uploadTask = uploadBytesResumable(storageRef, blob);

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           'state_changed',
//           null,
//           (error) => {
//             console.error('Upload failed', error);
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             console.log('Image uploaded successfully:', downloadURL);
//             resolve(downloadURL);
//           }
//         );
//       });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   };

//   const addCategory = async () => {
//     if (!categoryName.trim() || !imageUri) {
//       Alert.alert('Missing information', 'Please provide a name and select an image.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const imageUrl = await uploadImage(imageUri);
//       await addDoc(collection(db, 'categories'), {
//         name: categoryName,
//         img: imageUrl,
//         teamId: teamId, // Add teamId to category
//       });
//       Alert.alert('Category added!', 'Your category has been added successfully.');
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error adding category:', error);
//       Alert.alert('Error', `There was an error adding your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editCategory = async () => {
//     if (!selectedCategory || !categoryName.trim()) {
//       Alert.alert('Missing information', 'Please provide a name.');
//       return;
//     }

//     setLoading(true);
//     try {
//       let imageUrl = selectedCategory.img;
//       if (imageUri && imageUri !== selectedCategory.img) {
//         imageUrl = await uploadImage(imageUri);
//       }
//       await updateDoc(doc(db, 'categories', selectedCategory.id), {
//         name: categoryName,
//         img: imageUrl,
//       });
//       Alert.alert('Category updated!', 'Your category has been updated successfully.');
//       setSelectedCategory(null);
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategories();
//     } catch (error) {
//       console.error('Error updating category:', error);
//       Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       await deleteDoc(doc(db, 'categories', categoryId));
//       Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
//       fetchCategories();
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
//     }
//   };

//   const openMenu = (category) => {
//     setMenuCategory(category);
//     setMenuVisible(true);
//   };

//   const closeMenu = () => {
//     setMenuCategory(null);
//     setMenuVisible(false);
//   };

//   const openEditModal = (category) => {
//     setSelectedCategory(category);
//     setCategoryName(category.name);
//     setImageUri(category.img);
//     setModalVisible(true);
//     closeMenu();
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns;

//     if (item.addNew) {
//       return (
//         <TouchableOpacity
//           onPress={() => {
//             setSelectedCategory(null);
//             setCategoryName('');
//             setImageUri('');
//             setModalVisible(true);
//           }}
//           style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}
//         >
//           <View style={styles.addCategory}>
//             <Text style={styles.addCategoryText}>+ Add New Category</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('My Categories', { categoryId: item.id })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
//           <MaterialIcons name="more-vert" size={30} color="black" />
//         </TouchableOpacity>
//         {menuVisible && menuCategory && menuCategory.id === item.id && (
//           <View style={styles.menuContainer}>
//             <TouchableOpacity onPress={() => openEditModal(item)}>
//               <Text style={styles.menuItem}>Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => deleteCategory(item.id)}>
//               <Text style={styles.menuItem}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <TouchableWithoutFeedback onPress={closeMenu}>
//       <View style={styles.container}>
//         <FlatList
//           data={[{ addNew: true }, ...categories]}
//           keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
//           renderItem={renderCategoryItem}
//           numColumns={numColumns}
//           contentContainerStyle={styles.list}
//         />
//         <Button title="Manage Team" onPress={() => navigation.navigate('ManageTeam', { teamId, teamName })} />
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalView}>
//             <TextInput
//               placeholder="Category Name"
//               value={categoryName}
//               onChangeText={setCategoryName}
//               style={styles.input}
//             />
//             <TouchableOpacity onPress={selectImage}>
//               <Image
//                 source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                 style={styles.image}
//               />
//             </TouchableOpacity>
//             <View style={styles.buttonContainer}>
//               {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//               ) : (
//                 <>
//                   <Button title={selectedCategory ? "Edit Category" : "Add Category"} onPress={selectedCategory ? editCategory : addCategory} />
//                   <View style={styles.buttonSpacing} />
//                   <Button title="Cancel" onPress={() => setModalVisible(false)} />
//                 </>
//               )}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#f9f9f9',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addCategory: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//   },
//   addCategoryText: {
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
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
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     width: '100%',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 40,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//     elevation: 5,
//     padding: 10,
//     zIndex: 2,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//   },
// });

// export default CategoryListScreen;





import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const CategoryListScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);
  const route = useRoute();
  const { teamId, teamName } = route.params; // Get teamId and teamName from route params
  const numColumns = 2;

  useEffect(() => {
    //navigation.setOptions({ title: teamName }); // Set the header title to the team name
         navigation.setOptions({ title:'Team "' + teamName.toUpperCase()+'"' }); // Set the header title to the team name

    fetchCategories();
  }, [teamId, teamName]); // Add teamName to the dependency array

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(fetchedCategories);
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);
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
            console.log('Image uploaded successfully:', downloadURL);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addCategory = async () => {
    if (!categoryName.trim() || !imageUri) {
      Alert.alert('Missing information', 'Please provide a name and select an image.');
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadImage(imageUri);
      await addDoc(collection(db, 'categories'), {
        name: categoryName,
        img: imageUrl,
        teamId: teamId, // Add teamId to category
      });
      Alert.alert('Category added!', 'Your category has been added successfully.');
      setCategoryName('');
      setImageUri('');
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', `There was an error adding your category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async () => {
    if (!selectedCategory || !categoryName.trim()) {
      Alert.alert('Missing information', 'Please provide a name.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = selectedCategory.img;
      if (imageUri && imageUri !== selectedCategory.img) {
        imageUrl = await uploadImage(imageUri);
      }
      await updateDoc(doc(db, 'categories', selectedCategory.id), {
        name: categoryName,
        img: imageUrl,
      });
      Alert.alert('Category updated!', 'Your category has been updated successfully.');
      setSelectedCategory(null);
      setCategoryName('');
      setImageUri('');
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', `There was an error updating your category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      Alert.alert('Category deleted!', 'Your category has been deleted successfully.');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', `There was an error deleting your category: ${error.message}`);
    }
  };

  const openMenu = (category) => {
    setMenuCategory(category);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuCategory(null);
    setMenuVisible(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setImageUri(category.img);
    setModalVisible(true);
    closeMenu();
  };

  const renderCategoryItem = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 60) / numColumns;

    if (item.addNew) {
      return (
        <TouchableOpacity
          onPress={() => {
            setSelectedCategory(null);
            setCategoryName('');
            setImageUri('');
            setModalVisible(true);
          }}
          style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}
        >
          <View style={styles.addCategory}>
            <Text style={styles.addCategoryText}>+ Add New Category</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
          <Image source={{ uri: item.img }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
          <MaterialIcons name="more-vert" size={30} color="black" />
        </TouchableOpacity>
        {menuVisible && menuCategory && menuCategory.id === item.id && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <Text style={styles.menuItem}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
              <Text style={styles.menuItem}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        <FlatList
          data={[{ addNew: true }, ...categories]}
          keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
          renderItem={renderCategoryItem}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
        <Button title="Manage Team" onPress={() => navigation.navigate('ManageTeam', { teamId, teamName })} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
              style={styles.input}
            />
            <TouchableOpacity onPress={selectImage}>
              <Image
                source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <Button title={selectedCategory ? "Edit Category" : "Add Category"} onPress={selectedCategory ? editCategory : addCategory} />
                  <View style={styles.buttonSpacing} />
                  <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  list: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  categoryContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
    position: 'relative',
  },
  categoryContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '85%',
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryName: {
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addCategory: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  addCategoryText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSpacing: {
    width: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    zIndex: 2,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default CategoryListScreen;
