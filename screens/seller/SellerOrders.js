import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://10.12.60.237:5000/api/order/seller-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch orders: ${errorText}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => {
    // Filter items belonging to this seller
    const sellerItems = item.items.filter(orderItem => orderItem.itemId.sellerId.toString() === item.buyerId.toString());
    if (sellerItems.length === 0) return null;

    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderDate}>Ordered on: {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.buyerInfo}>Buyer: {item.buyerId.name} ({item.buyerId.email})</Text>
        <FlatList
          data={sellerItems}
          renderItem={({ item: orderItem }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: orderItem.itemId.itemImage }} style={styles.image} />
              <Text style={styles.itemName}>{orderItem.itemId.itemName}</Text>
              <Text style={styles.itemPrice}>${orderItem.itemPrice}</Text>
              <Text style={styles.quantity}>Quantity: {orderItem.quantity}</Text>
            </View>
          )}
          keyExtractor={(orderItem) => orderItem._id}
        />
        <Text style={styles.totalPrice}>Total (for your items): ${(sellerItems.reduce((sum, orderItem) => sum + (orderItem.itemPrice * orderItem.quantity), 0)).toFixed(2)}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.empty}>No orders found</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D77FF',
    textAlign: 'center',
    marginVertical: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buyerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D77FF',
    textAlign: 'right',
    marginTop: 10,
  },
  list: {
    paddingBottom: 20,
  },
  loading: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default SellerOrders;