import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuyerHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://10.12.60.237:5000/api/order/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched orders:', data); // Debug
      setOrders(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderDate}>Ordered on: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.orderStatus}>Status: {item.status || 'Pending'}</Text>
      <FlatList
        data={item.items}
        renderItem={({ item: orderItem }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: orderItem.itemImage }} style={styles.image} />
            <Text style={styles.itemName}>{orderItem.itemName}</Text>
            <Text style={styles.itemPrice}>${orderItem.itemPrice}</Text>
            <Text style={styles.quantity}>Quantity: {orderItem.quantity}</Text>
          </View>
        )}
        keyExtractor={(orderItem, index) => orderItem._id ? orderItem._id.toString() : index.toString()}
      />
      <Text style={styles.totalPrice}>Total: ${item.totalPrice.toFixed(2)}</Text>
    </View>
  );

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
      <Text style={styles.title}>Order History</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id.toString()}
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

export default BuyerHistory;