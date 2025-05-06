// navigation/SellerTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SellerPostOrders from '../screens/seller/SellerPostOrders';
import SellerOrders from '../screens/seller/SellerOrders';
import SellerProfile from '../screens/seller/SellerProfile';
import SellerDelivery from '../screens/seller/SellerDelivery';
import SellerOrderHistory from '../screens/seller/SellerOrderHistory';

const Tab = createBottomTabNavigator();

const SellerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Post Orders':
              iconName = 'add-circle-outline';
              break;
            case 'Orders':
              iconName = 'receipt-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Delivery':
              iconName = 'bicycle-outline';
              break;
            case 'Order History':
              iconName = 'time-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#536878', // Vibrant primary color
        tabBarInactiveTintColor: '#A3CAE9', // Softer gray for inactive items
        tabBarLabelStyle: {
          fontSize: 14, // Bigger text
          fontWeight: 'bold',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0, // Fully attached to bottom
          width: '100%',
          height: 70, // Taller for better icon fit
          backgroundColor: '#E9ECEE', // Red background like your image
          borderTopLeftRadius: 20, // Slight rounding at the top
          borderTopRightRadius: 20,
          borderBottomEndRadius: 20,
          borderBottomLeftRadius: 20,
          elevation: 5, // Subtle depth effect
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
      })}
    >
      <Tab.Screen name="Post Orders" component={SellerPostOrders} />
      <Tab.Screen name="Orders" component={SellerOrders} />
      <Tab.Screen name="Profile" component={SellerProfile} />
      <Tab.Screen name="Delivery" component={SellerDelivery} />
      <Tab.Screen name="Order History" component={SellerOrderHistory} />
    </Tab.Navigator>
  );
};

export default SellerTabs;
