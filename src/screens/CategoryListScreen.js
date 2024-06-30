


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
//     //navigation.setOptions({ title: teamName }); // Set the header title to the team name
//          navigation.setOptions({ title:'Team "' + teamName.toUpperCase()+'"' }); // Set the header title to the team name

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
//         <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
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




// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { FIREBASE_AUTH } from '../config/firebase';

// const CategoryListScreen = ({ navigation }) => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuCategory, setMenuCategory] = useState(null);
//   const [userRole, setUserRole] = useState(''); // To store the user's role
//   const route = useRoute();
//   const { teamId, teamName } = route.params; // Get teamId and teamName from route params
//   const numColumns = 2;
//   const user = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     navigation.setOptions({ title: `Team "${teamName.toUpperCase()}"` }); // Set the header title to the team name

//     fetchCategoriesAndRole();
//   }, [teamId, teamName]); // Add teamName to the dependency array

//   const fetchCategoriesAndRole = async () => {
//     const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
//     const querySnapshot = await getDocs(q);
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);

//     // Fetch user role
//     const teamDocRef = doc(db, 'teams', teamId);
//     const teamDoc = await getDoc(teamDocRef);
//     if (teamDoc.exists()) {
//       const teamData = teamDoc.data();
//       const member = teamData.members.find(m => m.uid === user.uid);
//       if (member) {
//         setUserRole(member.admin ? 'admin' : 'member');
//       }
//     }
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
//         <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         {userRole === 'admin' && (
//           <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
//             <MaterialIcons name="more-vert" size={30} color="black" />
//           </TouchableOpacity>
//         )}
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





// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback, Animated, Keyboard } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { FIREBASE_AUTH } from '../config/firebase';
// import CategorySearchBar from '../components/CategorySearchBar';

// const HEADER_HEIGHT = 92;

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const CategoryListScreen = ({ navigation }) => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuCategory, setMenuCategory] = useState(null);
//   const [userRole, setUserRole] = useState('');
//   const route = useRoute();
//   const { teamId, teamName } = route.params;
//   const numColumns = 2;
//   const user = FIREBASE_AUTH.currentUser;

//   const scrollY = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const searchBarRef = useRef(null);

//   useEffect(() => {
//     navigation.setOptions({ title: `"${teamName.toUpperCase()}"` });
//     fetchCategoriesAndRole();
//   }, [teamId, teamName]);

//   const fetchCategoriesAndRole = async () => {
//     const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
//     const querySnapshot = await getDocs(q);
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);

//     const teamDocRef = doc(db, 'teams', teamId);
//     const teamDoc = await getDoc(teamDocRef);
//     if (teamDoc.exists()) {
//       const teamData = teamDoc.data();
//       const member = teamData.members.find(m => m.uid === user.uid);
//       if (member) {
//         setUserRole(member.admin ? 'admin' : 'member');
//       }
//     }
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
//         teamId: teamId,
//       });
//       Alert.alert('Category added!', 'Your category has been added successfully.');
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategoriesAndRole();
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
//         if (selectedCategory.img) {
//           const oldImageRef = ref(storage, selectedCategory.img);
//           await deleteObject(oldImageRef);
//         }
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
//       fetchCategoriesAndRole();
//     } catch (error) {
//       console.error('Error updating category:', error);
//       Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       const categoryRef = doc(db, 'categories', categoryId);
//       const categoryDoc = await getDoc(categoryRef);
//       if (categoryDoc.exists()) {
//         const categoryData = categoryDoc.data();

//         const itemsQuerySnapshot = await getDocs(collection(db, 'categories', categoryId, 'items'));
//         for (const itemDoc of itemsQuerySnapshot.docs) {
//           const itemData = itemDoc.data();
//           if (itemData.img) {
//             const imgRef = ref(storage, itemData.img);
//             await deleteObject(imgRef);
//           }
//           await deleteDoc(doc(db, 'categories', categoryId, 'items', itemDoc.id));
//         }

//         if (categoryData.img) {
//           const categoryImgRef = ref(storage, categoryData.img);
//           await deleteObject(categoryImgRef);
//         }

//         await deleteDoc(categoryRef);

//         Alert.alert('Category deleted!', 'Your category and its items have been deleted successfully.');
//         fetchCategoriesAndRole();
//       } else {
//         Alert.alert('Error', 'Category not found.');
//       }
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

//   const handleItemSelect = (selectedCategory) => {
//     const index = categories.findIndex(category => category.id === selectedCategory.id);
//     const adjustedIndex = Math.floor(index / numColumns);

//     if (flatListRef.current && adjustedIndex >= 0) {
//       flatListRef.current.scrollToIndex({ index: adjustedIndex, animated: true });
//     } else {
//       console.warn('Index out of bounds:', adjustedIndex);
//     }
//   };

//   const handleScroll = () => {
//     searchBarRef.current?.clearInput();
//     Keyboard.dismiss();
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns;

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         {userRole === 'admin' && (
//           <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
//             <MaterialIcons name="more-vert" size={30} color="white" />
//           </TouchableOpacity>
//         )}
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

//   const headerTranslateY = scrollY.interpolate({
//     inputRange: [0, HEADER_HEIGHT],
//     outputRange: [0, -HEADER_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   return (
//     <TouchableWithoutFeedback onPress={closeMenu}>
//       <View style={styles.container}>
//         <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
//           <Text style={styles.teamName}>{teamName}</Text>
//           {categories.length > 0 && <CategorySearchBar ref={searchBarRef} items={categories} onSelect={handleItemSelect} />}
//         </Animated.View>
//         <Spacer height={80} />
//         {categories.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.emptyImage} />
//           </View>
//         ) : (
//           <AnimatedFlatList
//             ref={flatListRef}
//             data={categories}
//             keyExtractor={(item) => item.id}
//             renderItem={renderCategoryItem}
//             numColumns={numColumns}
//             initialNumToRender={categories.length}
//             maxToRenderPerBatch={categories.length}
//             contentContainerStyle={styles.list}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//               { useNativeDriver: true, listener: handleScroll }
//             )}
//             onScrollToIndexFailed={(info) => {
//               console.warn('scrollToIndex failed', info);
//               const wait = new Promise(resolve => setTimeout(resolve, 500));
//               wait.then(() => {
//                 flatListRef.current?.scrollToIndex({
//                   index: info.index,
//                   animated: true,
//                 });
//               });
//             }}
//           />
//         )}
//         <Button title="Manage Team" onPress={() => navigation.navigate('ManageTeam', { teamId, teamName })} />
//         {userRole === 'admin' && (
//           <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//             <Text style={styles.addButtonText}>+</Text>
//           </TouchableOpacity>
//         )}
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

// const Spacer = ({ height }) => {
//   return <View style={{ height }} />;
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
//   teamName: {
//     fontSize: 35,
//     zIndex: 1,
//     height: 53,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     color: 'white',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 90,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   categoryContainer: {
//     marginBottom: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     marginHorizontal: 10,
//     position: 'relative',
    
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '90%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderRadius: 20, 
//     shadowOffset: { width: 0, height: 2 },
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 1,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 9,
//     paddingTop: HEADER_HEIGHT,
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
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     backgroundColor: 'rgba(172, 188, 198, 0)',
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   menuButton: {
//     position: 'absolute',
//     top: 4,
//     right: 2,
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 35,
//     right: 20,
//     borderRadius: 15,
//     elevation: 5,
//     padding: 10,
//     zIndex: 2,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     fontSize: 18,
//     color: 'white',
//   },
//   addButton: {
//     backgroundColor: 'rgba(172, 188, 198, 0.7)',
//     padding: 10,
//     borderRadius: 90,
//     zIndex: 2,
//     alignItems: 'center',
//     width: 93,
//     height: 93,
//   },
//   addButtonText: {
//     fontSize: 69,
//     color: 'white',
//     borderRadius: 90,
//     alignContent: 'center',
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

// export default CategoryListScreen;




// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Alert, ActivityIndicator, TouchableWithoutFeedback, Animated, Keyboard } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
// import { storage, db } from '../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { FIREBASE_AUTH } from '../config/firebase';
// import CategorySearchBar from '../components/CategorySearchBar';
// import GetReport from '../components/GetReport'; // Import GetReport

// const HEADER_HEIGHT = 92;

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const CategoryListScreen = ({ navigation }) => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuCategory, setMenuCategory] = useState(null);
//   const [userRole, setUserRole] = useState('');
//   const route = useRoute();
//   const { teamId, teamName } = route.params;
//   const numColumns = 2;
//   const user = FIREBASE_AUTH.currentUser;

//   const scrollY = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const searchBarRef = useRef(null);
//   const [selectedCategoryForReport, setSelectedCategoryForReport] = useState(null);
//   useEffect(() => {
//     navigation.setOptions({ title: `"${teamName.toUpperCase()}"` });
//     fetchCategoriesAndRole();

//     const unsubscribeFocus = navigation.addListener('focus', () => {
//       setMenuVisible(false);
//     });

//     const unsubscribeBlur = navigation.addListener('blur', () => {
//       setMenuVisible(false);
//     });

//     return () => {
//       unsubscribeFocus();
//       unsubscribeBlur();
//     };
//   }, [teamId, teamName, navigation]);

//   const fetchCategoriesAndRole = async () => {
//     const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
//     const querySnapshot = await getDocs(q);
//     const fetchedCategories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setCategories(fetchedCategories);

//     const teamDocRef = doc(db, 'teams', teamId);
//     const teamDoc = await getDoc(teamDocRef);
//     if (teamDoc.exists()) {
//       const teamData = teamDoc.data();
//       const member = teamData.members.find(m => m.uid === user.uid);
//       if (member) {
//         setUserRole(member.admin ? 'admin' : 'member');
//       }
//     }
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

//     if (!result.canceled && result.assets && result.assets.length > 0) {
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
//         teamId: teamId,
//       });
//       Alert.alert('Category added!', 'Your category has been added successfully.');
//       setCategoryName('');
//       setImageUri('');
//       setModalVisible(false);
//       fetchCategoriesAndRole();
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
//         if (selectedCategory.img) {
//           const oldImageRef = ref(storage, selectedCategory.img);
//           await deleteObject(oldImageRef);
//         }
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
//       fetchCategoriesAndRole();
//     } catch (error) {
//       console.error('Error updating category:', error);
//       Alert.alert('Error', `There was an error updating your category: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       const categoryRef = doc(db, 'categories', categoryId);
//       const categoryDoc = await getDoc(categoryRef);
//       if (categoryDoc.exists()) {
//         const categoryData = categoryDoc.data();

//         const itemsQuerySnapshot = await getDocs(collection(db, 'categories', categoryId, 'items'));
//         for (const itemDoc of itemsQuerySnapshot.docs) {
//           const itemData = itemDoc.data();
//           if (itemData.img) {
//             const imgRef = ref(storage, itemData.img);
//             await deleteObject(imgRef);
//           }
//           await deleteDoc(doc(db, 'categories', categoryId, 'items', itemDoc.id));
//         }

//         if (categoryData.img) {
//           const categoryImgRef = ref(storage, categoryData.img);
//           await deleteObject(categoryImgRef);
//         }

//         await deleteDoc(categoryRef);

//         Alert.alert('Category deleted!', 'Your category and its items have been deleted successfully.');
//         fetchCategoriesAndRole();
//       } else {
//         Alert.alert('Error', 'Category not found.');
//       }
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

//   const handleItemSelect = (selectedCategory) => {
//     const index = categories.findIndex(category => category.id === selectedCategory.id);
//     const adjustedIndex = Math.floor(index / numColumns);

//     if (flatListRef.current && adjustedIndex >= 0) {
//       flatListRef.current.scrollToIndex({ index: adjustedIndex, animated: true });
//     } else {
//       console.warn('Index out of bounds:', adjustedIndex);
//     }
//   };

//   const handleScroll = () => {
//     searchBarRef.current?.clearInput();
//     Keyboard.dismiss();
//     closeMenu(); // Close the menu when scrolling
//   };

//   const renderCategoryItem = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const itemWidth = (screenWidth - 60) / numColumns;

//     return (
//       <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
//           <Image source={{ uri: item.img }} style={styles.categoryImage} />
//           <Text style={styles.categoryName}>{item.name}</Text>
//         </TouchableOpacity>
//         {userRole === 'admin' && (
//           <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
//             <MaterialIcons name="more-vert" size={30} color="white" />
//           </TouchableOpacity>
//         )}
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

//   const headerTranslateY = scrollY.interpolate({
//     inputRange: [0, HEADER_HEIGHT],
//     outputRange: [0, -HEADER_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   const openAddModal = () => {
//     setSelectedCategory(null);
//     setCategoryName('');
//     setImageUri('');
//     setModalVisible(true);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={closeMenu}>
//       <View style={styles.container}>
//         <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
//           <Text style={styles.teamName}>{teamName}</Text>
//           {categories.length > 0 && <CategorySearchBar ref={searchBarRef} items={categories} onSelect={handleItemSelect} />}
//         </Animated.View>
//         <Spacer height={80} />
//         {categories.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.emptyImage} />
//           </View>
//         ) : (
//           <AnimatedFlatList
//             ref={flatListRef}
//             data={categories}
//             keyExtractor={(item) => item.id}
//             renderItem={renderCategoryItem}
//             numColumns={numColumns}
//             initialNumToRender={categories.length}
//             maxToRenderPerBatch={categories.length}
//             contentContainerStyle={styles.list}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//               { useNativeDriver: true, listener: handleScroll }
//             )}
//             onScrollToIndexFailed={(info) => {
//               console.warn('scrollToIndex failed', info);
//               const wait = new Promise(resolve => setTimeout(resolve, 500));
//               wait.then(() => {
//                 flatListRef.current?.scrollToIndex({
//                   index: info.index,
//                   animated: true,
//                 });
//               });
//             }}
//           />
//         )}
//         <View style={styles.buttonRow}>
//           <TouchableOpacity onPress={() => navigation.navigate('ManageTeam', { teamId, teamName })} style={styles.manageTeamButton}>
//             <Text style={styles.manageTeamButtonText}>Manage Team</Text>
//           </TouchableOpacity>
//           {userRole === 'admin' && (
//             <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
//               <Text style={styles.addButtonText}>+ add category</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Modal
//           placeholderTextColor={"white"}
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalView}>
//               <TextInput
//                 placeholder="Category Name"
//                 value={categoryName}
//                 onChangeText={setCategoryName}
//                 style={styles.input}
//                 placeholderTextColor="white"
//               />
//               <TouchableOpacity onPress={selectImage}>
//                 <Image
//                   source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//                   style={[styles.image, { borderRadius: 20 }]} // Customizable border radius
//                 />
//               </TouchableOpacity>
//               <View style={styles.buttonContainer}>
//                 {loading ? (
//                   <ActivityIndicator size="large" color="#0000ff" />
//                 ) : (
//                   <>
//                     <TouchableOpacity style={[styles.button, styles.addCategoryButton]} onPress={selectedCategory ? editCategory : addCategory}>
//                       <Text style={styles.buttonText}>{selectedCategory ? "Update" : "Add Category"}</Text>
//                     </TouchableOpacity>
//                     <View style={styles.buttonSpacing} />
//                     <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
//                       <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity>
//                   </>
//                 )}
//               </View>
//             </View>
//           </View>
//         </Modal>
//         {selectedCategoryForReport && (
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={true}
//             onRequestClose={() => setSelectedCategoryForReport(null)}
//           >
//             <View style={styles.reportContainer}>
//               <GetReport categoryId={selectedCategoryForReport} />
//               <TouchableOpacity style={styles.button} onPress={() => setSelectedCategoryForReport(null)}>
//                 <Text style={styles.buttonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </Modal>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const Spacer = ({ height }) => {
//   return <View style={{ height }} />;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#9cacbc',
//   },
//   reportContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
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
//   teamName: {
//     fontSize: 35,
//     zIndex: 1,
//     height: 53,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1.3,
//     borderRadius: 20,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: 200,
//     color: 'white', // Ensure the text color is white
//   },
//   image: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   categoryContainer: {
//     marginBottom: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     marginHorizontal: 10,
//     position: 'relative',
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     fontSize: 18,
//     color: 'white',
//   },
//   categoryContent: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoryImage: {
//     width: '90%',
//     height: '85%',
//     resizeMode: 'cover',
//     borderRadius: 20,
//     shadowOffset: { width: 10, height: 2 },
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   categoryName: {
//     textAlign: 'center',
//     paddingTop: 1,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   list: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 9,
//     paddingTop: HEADER_HEIGHT,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalView: {
//     width: '80%',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: 'rgba(172, 188, 198, 0.8)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     width: '100%',
//   },
//   buttonSpacing: {
//     width: 20,
//   },
//   button: {
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//   },
//   addCategoryButton: {
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
//   cancelButton: {
//     elevation: 5,
//     paddingVertical: 1,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   menuButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   optionsContainer: {
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Your desired background color
//     padding: 5,
//     borderRadius: 10,
//   },
//   optionText: {
//     color: 'white', // Your desired text color
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
//   manageTeamButton: {
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//     width: '45%',
//   },
//   manageTeamButtonText: {
//     color: 'white',
//     fontSize: 19,
//     fontWeight: 'bold', 
//   },
//   addButton: {
//     elevation: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
//     borderRadius: 90,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20, // Add some margin to separate the button from the list
//     width: '45%',
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: 'rgba(172, 188, 198, 1.7)',
//     borderRadius: 10,
//     elevation: 5,
//     padding: 10,
//     zIndex: 2,
//   },
// });

// export default CategoryListScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Alert, ActivityIndicator, TouchableWithoutFeedback, Animated, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../config/firebase';
import CategorySearchBar from '../components/CategorySearchBar';
import GetReport from '../components/GetReport'; // Import GetReport
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonTools from '../components/ButtonTools'; // Import the HeaderIcons component

const HEADER_HEIGHT = 92;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CategoryListScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [loadingRole, setLoadingRole] = useState(true); // New state for loading role
  const [selectedCategoryForReport, setSelectedCategoryForReport] = useState(null); // Add state for report
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false); // New state for image picker modal
  const route = useRoute();
  const { teamId, teamName } = route.params;
  const numColumns = 2;
  const user = FIREBASE_AUTH.currentUser;

  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const searchBarRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: `"${teamName.toUpperCase()}"` });
    fetchCategoriesAndRole();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      setMenuVisible(false);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setMenuVisible(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [teamId, teamName, navigation]);

  const fetchCategoriesAndRole = async () => {
    setLoadingRole(true); // Set loading to true
    const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(fetchedCategories);

    const teamDocRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamDocRef);
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const member = teamData.members.find(m => m.uid === user.uid);
      if (member) {
        setUserRole(member.admin ? 'admin' : 'member');
      }
    }
    setLoadingRole(false); // Set loading to false
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setCategoryName('');
    setImageUri('');
    setModalVisible(true);
  };

  const buttons = [
    {
      iconName: 'account-cog',
      label: 'Account',
      onPress: () => navigation.navigate('UserSettingsScreen'),
    },
    {
      iconName: 'home',
      label: 'Home',
      onPress: () => navigation.navigate('Home'),
    },
    {
      iconName: 'plus-thick',
      label: 'Add Shelf',
      onPress: openAddModal,
    },
  ];

  const buttons2 = [
    {
      iconName: 'account-cog',
      label: 'Account',
      onPress: () => navigation.navigate('UserSettingsScreen'),
    },
    {
      iconName: 'home',
      label: 'Home',
      onPress: () => navigation.navigate('Home'),
    },
  ];

  const selectImage = async (source) => {
    let result;
    if (source === 'camera') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.granted === false) {
        alert("You've refused to allow this app to access your camera!");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryPermission.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImagePickerModalVisible(false); // Close the image picker modal
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
        teamId: teamId,
      });
      Alert.alert('Shelf added!', 'Your Shelf has been added successfully.');
      setCategoryName('');
      setImageUri('');
      setModalVisible(false);
      fetchCategoriesAndRole();
    } catch (error) {
      console.error('Error adding Shelf:', error);
      Alert.alert('Error', `There was an error adding your Shelf: ${error.message}`);
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
        if (selectedCategory.img) {
          const oldImageRef = ref(storage, selectedCategory.img);
          await deleteObject(oldImageRef);
        }
      }

      await updateDoc(doc(db, 'categories', selectedCategory.id), {
        name: categoryName,
        img: imageUrl,
      });

      Alert.alert('Shelf updated!', 'Your Shelf has been updated successfully.');
      setSelectedCategory(null);
      setCategoryName('');
      setImageUri('');
      setModalVisible(false);
      fetchCategoriesAndRole();
    } catch (error) {
      console.error('Error updating Shelf:', error);
      Alert.alert('Error', `There was an error updating your Shelf: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      const categoryDoc = await getDoc(categoryRef);
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();

        const itemsQuerySnapshot = await getDocs(collection(db, 'categories', categoryId, 'items'));
        for (const itemDoc of itemsQuerySnapshot.docs) {
          const itemData = itemDoc.data();
          if (itemData.img) {
            const imgRef = ref(storage, itemData.img);
            await deleteObject(imgRef);
          }
          await deleteDoc(doc(db, 'categories', categoryId, 'items', itemDoc.id));
        }

        if (categoryData.img) {
          const categoryImgRef = ref(storage, categoryData.img);
          await deleteObject(categoryImgRef);
        }

        await deleteDoc(categoryRef);

        Alert.alert('Shelf removed!', 'Your Shelf and its items have been removed successfully.');
        fetchCategoriesAndRole();
      } else {
        Alert.alert('Error', 'Shelf not found.');
      }
    } catch (error) {
      console.error('Error removing Shelf:', error);
      Alert.alert('Error', `There was an error removing your Shelf: ${error.message}`);
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

  const handleItemSelect = (selectedCategory) => {
    const index = categories.findIndex(category => category.id === selectedCategory.id);
    const adjustedIndex = Math.floor(index / numColumns);

    if (flatListRef.current && adjustedIndex >= 0) {
      flatListRef.current.scrollToIndex({ index: adjustedIndex, animated: true });
    } else {
      console.warn('Index out of bounds:', adjustedIndex);
    }
  };

  const handleScroll = () => {
    searchBarRef.current?.clearInput();
    Keyboard.dismiss();
    closeMenu(); // Close the menu when scrolling
  };

  const renderCategoryItem = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 60) / numColumns;

    return (
      <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', 
          { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
          <Image source={{ uri: item.img }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
        {userRole === 'admin' && (
          <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
            <MaterialCommunityIcons name="cog" size={24} color="white" />
          </TouchableOpacity>
        )}
        {menuVisible && menuCategory && menuCategory.id === item.id && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => setSelectedCategoryForReport(item.id)}>
              <Text style={styles.menuItem}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <Text style={styles.menuItem}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
              <Text style={styles.menuItem}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      {loadingRole ? ( // Show a loading indicator while the role is being fetched
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <View style={styles.container}>
          <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
            <Text style={styles.teamName}>{teamName}</Text>
            {categories.length > 0 && <CategorySearchBar ref={searchBarRef} items={categories} onSelect={handleItemSelect} />}
          </Animated.View>
          <Spacer height={80} />
          {categories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noCategories}>
                This Team Has No Shelves Yet. {''}
                {userRole !== 'admin' && (
                  <Text style={styles.noCategories}>New Shelves Will Appear Here When Added!</Text>
                )}
                {userRole === 'admin' && (
                  <Text style={styles.noCategories}>Add some shelves to start organizing your items!</Text>
                )}
              </Text>
              <Image source={require('../../assets/box2.png')} style={styles.emptyImage} />
            </View>
          ) : (
            <AnimatedFlatList
              ref={flatListRef}
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={renderCategoryItem}
              numColumns={numColumns}
              initialNumToRender={categories.length}
              maxToRenderPerBatch={categories.length}
              contentContainerStyle={styles.list}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true, listener: handleScroll }
              )}
              onScrollToIndexFailed={(info) => {
                console.warn('scrollToIndex failed', info);
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                });
              }}
            />
          )}
          {userRole === 'admin' && <ButtonTools buttons={buttons} />}
          {userRole !== 'admin' && <ButtonTools buttons={buttons2} />}
          <Modal
            placeholderTextColor={"white"}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <TextInput
                  placeholder="Shelf Name"
                  value={categoryName}
                  onChangeText={setCategoryName}
                  style={styles.input}
                  placeholderTextColor="white"
                />
                <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
                  <Image
                    source={imageUri ? { uri: imageUri } : require('../../assets/addImg.png')}
                    style={[styles.image, { borderRadius: 20 }]} // Customizable border radius
                  />
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                  {loading ? (
                    <ActivityIndicator size="large" color="white" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.button, styles.addCategoryButton]} onPress={selectedCategory ? editCategory : addCategory}>
                        <Text style={styles.buttonText}>{selectedCategory ? "Update" : "   Add    "}</Text>
                      </TouchableOpacity>
                      <View style={styles.buttonSpacing} />
                      <TouchableOpacity style={[styles.button, styles.addCategoryButton]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={imagePickerModalVisible}
            animationType="slide"
            onRequestClose={() => setImagePickerModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.imagePickerModal}>
                <Text style={styles.imagePickerTitle}>Select Image</Text>
                <Text style={styles.imagePickerSubtitle}>Choose the source of the image</Text>
                <View style={styles.imagePickerOptions}>
                  <TouchableOpacity onPress={() => selectImage('camera')}>
                    <Text style={styles.imagePickerOptionText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => selectImage('library')}>
                    <Text style={styles.imagePickerOptionText}>Library</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setImagePickerModalVisible(false)}>
                    <Text style={styles.imagePickerOptionText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {selectedCategoryForReport && ( // Add modal to show the report
            <Modal
              animationType="slide"
              transparent={false}
              visible={true}
              onRequestClose={() => setSelectedCategoryForReport(null)}
            >
              <View style={styles.reportContainer}>
                <GetReport categoryId={selectedCategoryForReport} />
                <TouchableOpacity style={styles.Xbutton} onPress={() => setSelectedCategoryForReport(null)}>
                  <Text style={styles.XbuttonText}>X</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

const Spacer = ({ height }) => {
  return <View style={{ height }} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9cacbc',
    justifyContent: 'center', // Ensure alignment of child components
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', backgroundColor: '#9cacbc',
    alignItems: 'center',
  },
  reportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9cacbc',
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
  teamName: {
    fontSize: 35,
    zIndex: 1,
    height: 43,
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 50,
    right: 27,
    backgroundColor: '#9cacbc',
    borderRadius: 90,
    padding: 35,
    elevation: 5,
    height: 90,
  },
  floatingAddButtonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',marginBottom: 2,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 200,
    color: 'white', // Ensure the text color is white
  },
  image: {
    width: 123,
    height: 115,
    marginBottom: 20,
    borderRadius: 10,
  },
  categoryContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
    position: 'relative',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    fontSize: 18,
    color: 'white',
  },
  categoryContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '90%',
    height: '85%',
    resizeMode: 'cover',
    borderRadius: 20,
    shadowOffset: { width: 10, height: 2 },
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryName: {
    textAlign: 'center',
    paddingTop: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
  list: {
    justifyContent: 'space-between',
    paddingHorizontal: 9,
    paddingTop: HEADER_HEIGHT,
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
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  Xbutton: {
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 33,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  addCategoryButton: {
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cancelButton: {
    elevation: 5,
    paddingVertical: 1,
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
  XbuttonText: {
    color: 'white',
    fontSize: 35,
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
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 16,
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
    fontSize: 25,
    zIndex: 1,
    height: 123,
    fontWeight: 'bold',marginLeft:19,
    color: 'white',marginBottom:1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',paddingHorizontal: 30,
  },
  emptyImage: {
    width: 430,
    height:300,
  },
  manageTeamButton: {
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
    width: '45%',
  },
  manageTeamButtonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold', 
  },
  addButton: {
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(172, 188, 198, 1.7)', // Change this to your desired button color
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add some margin to separate the button from the list
    width: '45%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 40,
    right: 30,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 10,
    elevation: 10, // Ensure this value is high enough
    padding: 8,
    zIndex: 10, // Set a high zIndex value
  },
  reportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9cacbc',
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 19,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    fontSize: 18,fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerModal: {
    width: '80%',
    backgroundColor: 'rgba(172, 188, 198, 1.1)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  imagePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  imagePickerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  imagePickerOptions: {
    width: '100%',
  },
  imagePickerOptionText: {
    fontSize: 21,
    color: 'white',
    padding: 8,
    textAlign: 'center',
  },
});

export default CategoryListScreen;
