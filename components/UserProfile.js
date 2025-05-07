import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('jwtToken');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        // Fetch user details from the backend
        const response = await fetch('http://10.12.34.68:5000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error Response Text:', errorText);
          throw new Error(`Failed to fetch user details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);
        setUser(data);
      } catch (err) {
        console.log('Fetch Error:', err.message);
        setError(err.message);
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('role');
      // Navigate the user back to the initial authentication screen (e.g., LoginScreen)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Replace 'Login' with the actual name of your login screen
      });
      Alert.alert('Logged out', 'Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Error during logout. Please try again.');
    }
  };

  console.log('Current State - User:', user);
  console.log('Current State - Loading:', loading);
  console.log('Current State - Error:', error);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4D77FF" />
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
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name || 'N/A'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user?.role || 'Buyer'}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user?.phone || 'N/A'}</Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{user?.location || 'N/A'}</Text>

        <Text style={styles.label}>UPI ID:</Text>
        <Text style={styles.value}>{user?.upiId || 'N/A'}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20, // Added some margin below the profile card
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Example red color for logout
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default UserProfile;