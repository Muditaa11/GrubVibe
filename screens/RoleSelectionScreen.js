import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const roles = [
    { title: 'Buyer', icon: '🛒', screen: 'RegisterBuyer' },
    { title: 'Seller', icon: '🏪', screen: 'RegisterSeller' },
    { title: 'Delivery Man', icon: '🚴', screen: 'RegisterDeliveryMan' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2b32b2" barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Choose Role</Text>
        <Text style={styles.headerSub}>Let's get started</Text>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomCard}>
        <View style={styles.grid}>
          {roles.map((role, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(role.screen)}
            >
              <Text style={styles.cardIcon}>{role.icon}</Text>
              <Text style={styles.cardText}>{role.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b32b2', // Blue gradient-style base
  },
  topHeader: {
    height: '30%',
    paddingTop: 60,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSub: {
    color: '#d0d0ff',
    fontSize: 14,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#f5f8fd',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
