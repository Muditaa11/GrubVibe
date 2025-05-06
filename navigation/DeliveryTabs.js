import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DeliveryOrders from '../screens/delivery/DeliveryOrders';
import DeliveryHistory from '../screens/delivery/DeliveryHistory';
import DeliveryProfile from '../screens/delivery/DeliveryProfile';
import DeliveryTask from '../screens/delivery/DeliveryTask';
import DeliveryMessages from '../screens/delivery/DeliveryMessages';

const Tab = createBottomTabNavigator();

const DeliveryTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Order':
              iconName = 'list-outline';
              break;
            case 'History':
              iconName = 'time-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Delivery':
              iconName = 'bicycle-outline';
              break;
            case 'Message':
              iconName = 'chatbubble-ellipses-outline';
              break;
            default:
              iconName = 'ellipse-outline';
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
      <Tab.Screen name="Order" component={DeliveryOrders} />
      <Tab.Screen name="History" component={DeliveryHistory} />
      <Tab.Screen name="Profile" component={DeliveryProfile} />
      <Tab.Screen name="Delivery" component={DeliveryTask} />
      <Tab.Screen name="Message" component={DeliveryMessages} />
    </Tab.Navigator>
  );
};

export default DeliveryTabs;
