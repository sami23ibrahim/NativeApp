import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const GetReport = ({ categoryId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    if (categoryId) {
      console.log('Fetching items for category ID:', categoryId);
      fetchItems();
    }
  }, [categoryId]);

  const fetchItems = async () => {
    try {
      // Check if the category exists
      const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
      if (!categoryDoc.exists()) {
        console.error('Category not found:', categoryId);
        return;
      }

      const categoryData = categoryDoc.data();
      setCategoryName(categoryData.name);

      // Query to fetch items with quantity > 0
      const q = query(collection(db, 'categories', categoryId, 'items'), where('quantity', '>', 0));
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched items with quantity > 0:', fetchedItems);

      // If no items with quantity > 0, fetch all items for debugging
      if (fetchedItems.length === 0) {
        const allItemsSnapshot = await getDocs(collection(db, 'categories', categoryId, 'items'));
        const allItems = allItemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched all items:', allItems);
      }

      setItems(fetchedItems);
      setTimestamp(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName} Inventory</Text>
      <Text style={styles.timestamp}>Report generated on: {timestamp}</Text>
      {items.length === 0 ? (
        <View style={styles.noItemsContainer}>
            <Text style={styles.title}>{categoryName} Shelf has No items </Text>
          <Image
           source={require('../../assets/box.png')}
           

            style={styles.placeholderImage}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name} : {item.quantity}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9cacbc',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 14,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
  },
  noItemsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  placeholderImage: {
    width:460,
    height: 390,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: 'rgba(172, 188, 198, 1.7)',
    borderRadius: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 18,    fontWeight: 'bold',

  },
});

export default GetReport;
