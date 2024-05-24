import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import UserInterface from './src/screens/UserInterface';
import MetodoPago from './src/screens/MetodoPago';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import UserDetail from './src/screens/UserDetail';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInterface" component={UserInterface} options={{ headerShown: false }}/>
        <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: false }} />
        <Stack.Screen name="MetodoPago" component={MetodoPago} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
