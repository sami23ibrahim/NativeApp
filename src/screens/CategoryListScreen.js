


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


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../config/firebase';

const CategoryListScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);
  const [userRole, setUserRole] = useState(''); // To store the user's role
  const route = useRoute();
  const { teamId, teamName } = route.params; // Get teamId and teamName from route params
  const numColumns = 2;
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    navigation.setOptions({ title: `Team "${teamName.toUpperCase()}"` }); // Set the header title to the team name

    fetchCategoriesAndRole();
  }, [teamId, teamName]); // Add teamName to the dependency array

  const fetchCategoriesAndRole = async () => {
    const q = query(collection(db, 'categories'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    const fetchedCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(fetchedCategories);

    // Fetch user role
    const teamDocRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamDocRef);
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const member = teamData.members.find(m => m.uid === user.uid);
      if (member) {
        setUserRole(member.admin ? 'admin' : 'member');
      }
    }
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
      fetchCategoriesAndRole();
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
      fetchCategoriesAndRole();
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
      fetchCategoriesAndRole();
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

    return (
      <View style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryDetailScreen', { categoryId: item.id, categoryName: item.name, teamName })} style={styles.categoryContent}>
          <Image source={{ uri: item.img }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
        {userRole === 'admin' && (
          <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuButton}>
            <MaterialIcons name="more-vert" size={30} color="black" />
          </TouchableOpacity>
        )}
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
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
        <Button title="Manage Team" onPress={() => navigation.navigate('ManageTeam', { teamId, teamName })} />
        {userRole === 'admin' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add New Category</Text>
          </TouchableOpacity>
        )}
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
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CategoryListScreen;
