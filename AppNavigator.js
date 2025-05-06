// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterBuyerScreen from './screens/register/RegisterBuyerScreen';
import RegisterSellerScreen from './screens/register/RegisterSellerScreen';
import RegisterDeliveryManScreen from './screens/register/RegisterDeliveryManScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
// import SellerHomeScreen from './screens/SellerHomeScreen';
// import DeliveryHomeScreen from './screens/DeliveryHomeScreen';
import SellerTabs from './navigation/SellerTabs';
import BuyerTabs from './navigation/BuyerTabs'; // Import tab navigator for buyers
import DeliveryTabs from './navigation/DeliveryTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelection" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="RegisterBuyer" component={RegisterBuyerScreen} />
        <Stack.Screen name="RegisterSeller" component={RegisterSellerScreen} />
        <Stack.Screen name="RegisterDeliveryMan" component={RegisterDeliveryManScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BuyerTabs" component={BuyerTabs} />
        <Stack.Screen name="SellerTabs" component={SellerTabs} />
        <Stack.Screen name="DeliveryTabs" component={DeliveryTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
