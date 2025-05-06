import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeliveryHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order History Screen</Text>
    </View>
  );
};

export default DeliveryHistory;

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
