import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategorySearchBar = forwardRef(({ items, onSelect }, ref) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const flatListRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clearInput: () => {
      setQuery('');
      setSuggestions([]);
    }
  }));

  useEffect(() => {
    if (query.length > 0) {
      const filteredSuggestions = items
        .filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 3);

      if (filteredSuggestions.length < 3) {
        const additionalSuggestions = items
          .filter(item => !item.name.toLowerCase().startsWith(query.toLowerCase()) && item.name.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 3 - filteredSuggestions.length);
        setSuggestions([...filteredSuggestions, ...additionalSuggestions]);
      } else {
        setSuggestions(filteredSuggestions);
      }
    } else {
      setSuggestions([]);
    }
  }, [query, items]);

  const handleSelect = (item) => {
    setQuery('');
    setSuggestions([]);
    onSelect(item);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput 
        style={styles.searchInput}
        placeholder="  Search Shelves..."
        placeholderTextColor='white'
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && suggestions.length === 0 && (
        <Text style={styles.noResults}  >  No matches found</Text>
      )}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelect(item)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    padding: 11,
    width: '95%', 
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: 'black',
    zIndex: 1,
  },
  searchInput: {
    height: 45,
    borderRadius: 40,
    borderColor: '#ccc',
    borderWidth: 2.4,
    paddingLeft: 13,
    color: 'white', // Set text color to white
  },
  noResults: {
    padding: 12,
    color: 'white', 
    backgroundColor: 'black',
    width: '90%', 
    borderRadius: 40,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    marginTop: 4,
    zIndex: 1,
    position: 'absolute',
    top: 55,
  },
  suggestionsContainer: {
    backgroundColor: 'black',
    borderColor: '#ccc',
    borderWidth: 2,
    marginTop: 5,
    borderRadius: 10,
    width: '90%',  
    alignSelf: 'center',
    zIndex: 2,
    position: 'absolute',
    top: 55, // Adjust this value based on your input height and padding
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CategorySearchBar;
