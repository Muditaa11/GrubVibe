import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';

const BuyerRegisterScreen = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    upiId: '',
    password: '',
  });

  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };


const handleRegister = async () => {
  try {
    // Add role manually here if your backend expects it
    const dataToSend = { ...form, role: 'buyer' };

    await axios.post('http://10.12.34.68:5000/api/register', dataToSend);

    // Redirect to login screen on success
    navigation.navigate('Login');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Failed to register. Try again.');
  }
};


  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Register as Buyer</Text>
              <Text style={styles.headerSubtitle}>
                Start shopping for your favorite items
              </Text>
            </View>

            <View style={styles.form}>
              {[
                { placeholder: 'Full Name', key: 'name' },
                { placeholder: 'Email', key: 'email' },
                { placeholder: 'Phone Number', key: 'phone', keyboard: 'phone-pad' },
                { placeholder: 'Location', key: 'location' },
                { placeholder: 'UPI ID', key: 'upiId' },
                { placeholder: 'Password', key: 'password', secure: true },
              ].map(({ placeholder, key, keyboard, secure }) => (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={placeholder}
                  value={form[key]}
                  onChangeText={(text) => handleChange(key, text)}
                  keyboardType={keyboard || 'default'}
                  secureTextEntry={secure || false}
                  placeholderTextColor="#999"
                />
              ))}

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                    Already have an account? <Text style={{ color: '#4D77FF' }}>Log in</Text>
                </Text>
            </TouchableOpacity>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF3F9',
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2A2E43',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7D8FAB',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: '#F8F9FB',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDE2E6',
  },
  button: {
    backgroundColor: '#4D77FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BuyerRegisterScreen;
