import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import UserInterface from './src/screens/UserInterface';
import MetodoPago from './src/screens/MetodoPago';
import ChatScreen from './src/screens/ChatScreen';
import ChatScreenDetail from './src/screens/ChatScreenDetail';
import CalendarScreen from './src/screens/CalendarScreen';
import UserDetail from './src/screens/UserDetail';
import SearchScreen from './src/screens/SearchScreen';
import TeacherInterface from './src/screens/TeacherInterface';
import ProfesorDetail from './src/screens/ProfesorDetail';
import ClaseDetail from './src/screens/ClaseDetail';
import TerminosyCondiciones from './src/screens/TerminosyCondiciones'; // Importa el nuevo componente
import StudentSearchScreen from './src/screens/StudentSearchScreen'; // Importa el nuevo componente


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInterface" component={UserInterface} options={{ headerShown: false }}/>
        <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: false }} />
        <Stack.Screen name="MetodoPago" component={MetodoPago} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreenDetail" component={ChatScreenDetail} options={{ headerShown: false }} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherInterface" component={TeacherInterface} options={{ headerShown: false }} />
        <Stack.Screen name="ProfesorDetail" component={ProfesorDetail} options={{ headerShown: false }} />
        <Stack.Screen name="ClaseDetail" component={ClaseDetail} options={{ headerShown: false }} />
        <Stack.Screen name="TerminosyCondiciones" component={TerminosyCondiciones} options={{ headerShown: false }}/> 
        <Stack.Screen name="StudentSearchScreen" component={StudentSearchScreen} options={{ headerShown: false }}/> 


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
