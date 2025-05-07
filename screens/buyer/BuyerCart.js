import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const BuyerCart = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        // Fetch cart
        const cartResponse = await fetch('http://10.12.34.68:5000/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!cartResponse.ok) throw new Error('Failed to fetch cart');
        const cartData = await cartResponse.json();
        setCart(cartData);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])
);

const handleEmptyCart = async () => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No token found. Please log in again.');
    }

    const response = await fetch('http://10.12.34.68:5000/api/cart/empty', {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to empty cart');
    setCart({ items: [] }); // Update the frontend state to reflect the cart is empty
    Alert.alert('Success', 'Your cart has been emptied.');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

const handleCheckout = async () => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No token found. Please log in again.');
    }
    if (!cart || !cart._id) {
      throw new Error('Cart ID is missing or invalid');
    }
    console.log('Sending checkout with cartId:', cart._id)

    const response = await fetch('http://10.12.34.68:5000/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) throw new Error('Failed to checkout');
    const orderData = await response.json();
    Alert.alert('Success', 'Your order has been placed.');
    setCart({ items: [] }); // Clear the cart after checkout
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

const calculateTotalPrice = () => {
  return cart && cart.items
    ? cart.items.reduce((total, item) => total + item.itemPrice * item.quantity, 0)
    : 0;
};



  const renderCartItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.itemImage }} style={styles.image} />
      <Text style={styles.label}>Item Name:</Text>
      <Text style={styles.value}>{item.itemName}</Text>
      <Text style={styles.label}>Item Info:</Text>
      <Text style={styles.value}>{item.itemInfo}</Text>
      <Text style={styles.label}>Price:</Text>
      <Text style={styles.value}>${item.itemPrice}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{item.location}</Text>
      <Text style={styles.label}>Quantity:</Text>
      <Text style={styles.value}>{item.quantity}</Text>
    </View>
  );

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <><View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cart && cart.items.length > 0 ? (
        <FlatList
          data={cart.items}
          renderItem={renderCartItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list} />
      ) : (
        <Text style={styles.empty}>Your cart is empty</Text>
      )}
    </View>
        <View style={styles.totalPriceContainer}>
      <Text style={styles.totalPrice}>Total:  ₹{calculateTotalPrice()}</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Empty Cart" onPress={handleEmptyCart} />
        <Button title="Checkout" onPress={handleCheckout} />
      </View>
    </View>

    </>
    
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
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  list: {
    paddingBottom: 20,
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  totalPriceContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    paddingBottom: 80,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
});

export default BuyerCart;