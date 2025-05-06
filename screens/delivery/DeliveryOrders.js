import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeliveryOrders = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Delivery Orders Screen</Text>
    </View>
  );
};

export default DeliveryOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
