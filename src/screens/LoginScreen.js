import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RegisterModal from '../components/RegisterModal'; // Ajusta la ruta según la ubicación de RegisterModal.js

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containercenter}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={openModal}>
            <Text style={styles.buttonTextRegister}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonTextLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RegisterModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containercenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 50,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextRegister: {
    color: '#000',
  },
  buttonTextLogin: {
    color: '#fff',
  },
});

export default LoginScreen;
