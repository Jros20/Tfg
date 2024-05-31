import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import UserInterface from '../screens/UserInterface';
import MetodoPago from '../screens/MetodoPago';
import ChatScreen from '../screens/ChatScreen';
import ChatScreenDetail from '../screens/ChatScreenDetail';
import CalendarScreen from '../screens/CalendarScreen';
import UserDetail from '../screens/UserDetail';
import SearchScreen from '../screens/SearchScreen';
import TeacherInterface from '../screens/TeacherInterface';
import ProfesorDetail from '../screens/ProfesorDetail';
import ClaseDetail from '../screens/ClaseDetail';
import TerminosyCondiciones from '../screens/TerminosyCondiciones';
import StudentSearchScreen from '../screens/StudentSearchScreen';

const Stack = createStackNavigator();

function Navigation() {
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

export default Navigation;
