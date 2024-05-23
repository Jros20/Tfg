import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de tener instalada la biblioteca de iconos
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native'; // Importamos useNavigation

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useSharedValue(0);
  const navigation = useNavigation(); // Obtenemos la navegación

  const openModal = () => {
    setModalVisible(true);
    opacity.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
  };

  const closeModal = () => {
    opacity.value = withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }, false); 
    setModalVisible(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));


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
          <TouchableOpacity style={styles.registerButton}  onPress={openModal}>
            <Text style={styles.buttonTextRegister}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.buttonTextLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} 
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal} 
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your password..."
              placeholderTextColor="#666"
              secureTextEntry
            />

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              placeholderTextColor="#666"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.studentButton}  onPress={() => navigation.navigate('UserInterface')}>
                <Text style={styles.buttonTextStudent}>ALUMNO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.teacherButton}>
                <Text style={styles.buttonTextTeacher}>PROFESOR</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'90%',
    marginStart:'5%',
    height:'90%',
    marginBottom:'20%'

  },
  modalContent: {
    width: '80%',
    backgroundColor: '#cccccc',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,

    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  buttonTextStudent: {
    color: '#000',
  },
  buttonTextTeacher: {
    color: '#fff',
  },
  studentButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  teacherButton: {
    flex: 1,
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default LoginScreen;