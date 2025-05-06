import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const BuyerItemDetail = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹ {item.price}</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Item Info:</Text>
        <Text style={styles.text}>{item.info}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Location:</Text>
        <Text style={styles.text}>{item.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Seller Name:</Text>
        <Text style={styles.text}>{item.sellerName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Seller Email:</Text>
        <Text style={styles.text}>{item.sellerEmail}</Text>
      </View>

      <TouchableOpacity style={styles.cartButton}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 20,
    color: '#4D77FF',
    marginVertical: 10,
  },
  section: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  text: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
  cartButton: {
    marginTop: 20,
    backgroundColor: '#4D77FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BuyerItemDetail;
