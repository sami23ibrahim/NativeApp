
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, TextInput, Button, Alert, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const CategoryListScreen = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const numColumns = 2; // Number of columns

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const fetchedCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
  };

  const addCategory = async () => {
    if (categoryName && imageUri) {
      setLoading(true);
      try {
        const imageUrl = await uploadImage(imageUri);
        await addDoc(collection(db, 'categories'), {
          name: categoryName,
          img: imageUrl,
        });
        Alert.alert('Category added!', 'Your category has been added successfully.');
        setCategoryName('');
        setImageUri('');
        setModalVisible(false);
        fetchCategories();
      } catch (error) {
        console.error('Error adding category: ', error);
        Alert.alert('Error', `There was an error adding your category: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Missing information', 'Please provide a name and select an image.');
    }
  };

  const navigateToCategoryDetail = (categoryId) => {
    navigation.navigate('My Categories', { categoryId });
  };

  const renderCategoryItem = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 60) / numColumns; // Adjust for padding/margin

    if (item.addNew) {
      return (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
          <View style={styles.addCategory}>
            <Text style={styles.addCategoryText}>+ Add New Category</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={() => navigateToCategoryDetail(item.id)} style={[styles.categoryContainer, { width: itemWidth, height: itemWidth }]}>
        <Image source={{ uri: item.img }} style={styles.categoryImage} />
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ addNew: true }, ...categories]}
        keyExtractor={(item) => (item.addNew ? 'addNew' : item.id)}
        renderItem={renderCategoryItem}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setCategoryName('');
          setImageUri('');
        }}
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
                <Button title="Add Category" onPress={addCategory} />
                <View style={styles.buttonSpacing} />
                <Button title="Cancel" onPress={() => {
                  setModalVisible(false);
                  setCategoryName('');
                  setImageUri('');
                }} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default CategoryListScreen;


