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
        placeholder="Search Shelves..."
        placeholderTextColor='white'
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && suggestions.length === 0 && (
        <Text style={styles.noResults}>No matches found</Text>
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
    padding: 14,
    width: '95%', 
    borderRadius: 0,
    alignSelf: 'center',
    backgroundColor: '#9cacbc',
  },
  searchInput: {
    height: 50,
    borderRadius: 40,
    borderColor: '#ccc',
    borderWidth: 2.4,
    paddingLeft: 13,
    color: 'white',
  },
  noResults: {
    padding: 10,
    color: '#ccc',
    backgroundColor: '#9cacbc',
    width: '95%', 
    borderRadius: 40,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
  },
  suggestionsContainer: {
    backgroundColor: '#9cacbc',
    borderColor: '#ccc',
    borderWidth: 2,
    marginTop: 5,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    color: 'white',
  },
});

export default CategorySearchBar;
