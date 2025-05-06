// navigation/BuyerTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BuyerHome from '../screens/buyer/BuyerHome';
import BuyerSearch from '../screens/buyer/BuyerSearch';
import BuyerCart from '../screens/buyer/BuyerCart';
import BuyerHistory from '../screens/buyer/BuyerHistory';
import BuyerProfile from '../screens/buyer/BuyerProfile';

const Tab = createBottomTabNavigator();

const BuyerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Search: 'search-outline',
            Cart: 'cart-outline',
            History: 'time-outline',
            Profile: 'person-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] || 'alert-circle-outline'} // Fallback icon
              size={size}
              color={color}
            />
          );
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
      <Tab.Screen
        name="Home"
        component={BuyerHome}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Search"
        component={BuyerSearch}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="Cart"
        component={BuyerCart}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen
        name="History"
        component={BuyerHistory}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Profile"
        component={BuyerProfile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default BuyerTabs;