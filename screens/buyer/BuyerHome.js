import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuyerHome = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItems = async (searchQuery = '', locationQuery = '') => {
    try {
      setLoading(true);
      let url = 'http://10.12.60.237:5000/api/items';
      const params = [];
      if (searchQuery) params.push(`name=${searchQuery}`);
      if (locationQuery) params.push(`location=${locationQuery}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch items');
      setItems(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = () => {
    fetchItems(search, locationFilter);
  };

  const handleAddToCart = async (item) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const response = await fetch('http://10.12.60.237:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemInfo: item.itemInfo,
          itemImage: item.itemImage,
          location: item.location,
          itemId: item._id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
      Alert.alert('Success', 'Item added to cart');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.itemImage }} style={styles.image} />
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.itemPrice}>${item.itemPrice}</Text>
      <Button
        title="Add to Cart"
        onPress={() => handleAddToCart(item)}
        color="#4D77FF"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Items</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by location"
        value={locationFilter}
        onChangeText={setLocationFilter}
      />
      <Button title="Apply Filters" onPress={handleSearch} color="#4D77FF" />
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D77FF',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default BuyerHome;