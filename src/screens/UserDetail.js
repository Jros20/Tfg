import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../utils/firebase';
import { updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';

const UserDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openProfileModal = () => {
    userIconRef.current.measure((fx, fy, width, height, px, py) => {
      setUserIconPosition({ x: px, y: py + height });
      setProfileModalVisible(true);
    });
  };
  const closeProfileModal = () => setProfileModalVisible(false);

  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
  };

  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } else if (item.name === 'METODO DE PAGO') {
      navigation.navigate('MetodoPago');
    } else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 2, name: 'METODO DE PAGO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!editable) {
      setEditable(true);
      return;
    }

    const user = auth.currentUser;

    try {
      // Actualizar la contraseña si se ha ingresado una nueva
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Guardar la información actualizada en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        profileImage,
      }, { merge: true });

      Alert.alert('Éxito', 'Información actualizada correctamente');
      setEditable(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la información');
      console.error('Error al actualizar la información del usuario:', error);
    }
  };

  const pickImage = async () => {
    // Pedir permisos para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      const user = auth.currentUser;
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      setLoading(true);
      try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Puedes mostrar el progreso de la subida si lo deseas
          },
          (error) => {
            setLoading(false);
            Alert.alert('Error', 'Error al subir la imagen');
            console.error('Error al subir la imagen:', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              setProfileImage(downloadURL);

              // Guardar URL de la imagen en Firestore
              const userDocRef = doc(db, 'users', user.uid);
              await setDoc(userDocRef, { profileImage: downloadURL }, { merge: true });
              setLoading(false);
            });
          }
        );
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Error al subir la imagen');
        console.error('Error al subir la imagen:', error);
      }
    } else {
      console.log('No valid image selected');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>DETALLES USUARIO</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchScreen')}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerInside}>
        <TouchableOpacity onPress={pickImage}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="user" size={100} color="#000" />
          )}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>NOMBRE</Text>
          <TextInput
            style={styles.input}
            value={name}
            editable={editable}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            editable={editable}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Nueva contraseña"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{editable ? 'GUARDAR INFORMACIÓN' : 'EDITAR INFORMACIÓN'}</Text>
        </TouchableOpacity>
      </View>

      <Footer />
      
      <MenuModal
        visible={modalVisible}
        onClose={closeModal}
        menuItems={menuItems}
        handleMenuItemPress={handleMenuItemPress}
      />
      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
        navigateToUserDetail={navigateToUserDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  containerInside: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserDetail;
