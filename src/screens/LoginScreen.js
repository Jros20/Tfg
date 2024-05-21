import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de tener instalada la biblioteca de iconos


const LoginScreen = () => {

  const [modalVisible, setModalVisible] = useState(false);

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
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.buttonTextRegister}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton}         onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonTextLogin}>Login</Text>
        </TouchableOpacity>
      </View>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
         <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password..."
              placeholderTextColor="#666"
              secureTextEntry
            />

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.studentButton}>
                <Text style={styles.buttonTextStudent}>ALUMNO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.teacherButton}>
                <Text style={styles.buttonTextTeacher}>PROFESOR</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  containercenter:{
    
    width: '80%',
   
    alignItems: 'center',
    position: 'relative',
    
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 50,
  },
  input: {
    width: '80%',
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
    width: '100%',   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(114, 114, 114, 0.95)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
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
  input: {
    width: '100%',
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
    width: '100%',
    marginTop: 20,
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
  buttonTextStudent: {
    color: '#000',
  },
  buttonTextTeacher: {
    color: '#fff',
  },
});

export default LoginScreen;
