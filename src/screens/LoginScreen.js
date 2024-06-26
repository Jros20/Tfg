import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../utils/firebase';
import User from '../model/User';

const DEFAULT_PROFILE_PICTURE = require('../assets/img/default-profile-picture.png');

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const opacity = useSharedValue(0);
  const navigation = useNavigation();

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

  const uploadDefaultImage = async (uid) => {
    try {
      const response = await fetch(Image.resolveAssetSource(DEFAULT_PROFILE_PICTURE).uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading default image: ", error);
      throw error;
    }
  };

  const handleRegister = async (role) => {
    if (!email || !password || !name) {
      Alert.alert('Error de registro', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Subir la imagen por defecto
      const profilePictureUrl = await uploadDefaultImage(user.uid);

      // Crear un nuevo usuario usando la clase User
      const newUser = new User(user.uid, name, email, role, profilePictureUrl);

      // Guardar información del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());

      Alert.alert('Registro exitoso', `Usuario registrado como ${role}`);
      closeModal();
    } catch (error) {
      Alert.alert('Error de registro', error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error de inicio de sesión', 'Por favor ingrese el correo electrónico y la contraseña.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el documento del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'PROFESOR') {
          navigation.navigate('TeacherInterface'); // Redirigir a la pantalla del profesor
        } else if (userData.role === 'ALUMNO') {
          navigation.navigate('UserInterface'); // Redirigir a la pantalla del alumno
        } else {
          Alert.alert('Error', 'Rol no reconocido.');
        }
      } else {
        Alert.alert('Error', 'El usuario no tiene un perfil registrado.');
      }
    } catch (error) {
      Alert.alert('Error de inicio de sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containercenter}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={openModal}>
            <Text style={styles.buttonTextRegister}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your password..."
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.studentButton} onPress={() => {
                setRole('ALUMNO');
                handleRegister('ALUMNO');
              }}>
                <Text style={styles.buttonTextStudent}>ALUMNO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.teacherButton} onPress={() => {
                setRole('PROFESOR');
                handleRegister('PROFESOR');
              }}>
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
