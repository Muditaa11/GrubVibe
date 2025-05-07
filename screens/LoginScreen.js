import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BuyerTabs from '../navigation/BuyerTabs'
import SellerTabs from '../navigation/SellerTabs';
import DeliveryTabs from '../navigation/DeliveryTabs';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('http://10.12.34.68:5000/api/login', {
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Login response:', response.data);

      const { token, user } = response.data;
      if (!token || !user?.role) {
        alert('Login failed. Invalid response from server.');
        return;
      }

      // Use 'jwtToken' as the key to save the token
      await AsyncStorage.setItem('jwtToken', token);
      await AsyncStorage.setItem('role', user.role);

      if (user.role === 'buyer') navigation.navigate(BuyerTabs);
      else if (user.role === 'seller') navigation.navigate(SellerTabs);
      else if (user.role === 'delivery') navigation.navigate(DeliveryTabs);
      else alert('Unknown role');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <LinearGradient colors={['#FFD3B6', '#FFBEC4']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, width: '90%' },
  icon: { marginRight: 10 },
  input: { flex: 1, color: '#00008B', fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', width: '90%', marginTop: 10, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }, android: { elevation: 3 } }) },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  registerText: { color: '#fff', marginTop: 15, fontSize: 16 }
});

export default LoginScreen;