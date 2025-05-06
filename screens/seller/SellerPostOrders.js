import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SellerPostOrders = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemInfo, setItemInfo] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [location, setLocation] = useState('');

  const handlePostItem = async () => {
    if (!itemName || !itemPrice || !itemInfo || !itemImage || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const response = await fetch('http://10.12.60.237:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          itemPrice: parseFloat(itemPrice),
          itemInfo,
          itemImage,
          location,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post item');
      }

      Alert.alert('Success', 'Item posted successfully');
      // Reset form
      setItemName('');
      setItemPrice('');
      setItemInfo('');
      setItemImage('');
      setLocation('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a New Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Price"
        value={itemPrice}
        onChangeText={setItemPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Item Info"
        value={itemInfo}
        onChangeText={setItemInfo}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Item Image URL"
        value={itemImage}
        onChangeText={setItemImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Post Item" onPress={handlePostItem} color="#4D77FF" />
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
});

export default SellerPostOrders;