import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Curso from '../model/Curso';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase';

const FabModal = ({ visible, onClose, onSave }) => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Categorias'));
        const fetchedCategories = [];
        querySnapshot.forEach((doc) => {
          fetchedCategories.push({ id: doc.id, ...doc.data() });
        });
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseName || !description || !duration || !categoryId || !image) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      await Curso.create(courseName, description, duration, categoryId, image);
      setLoading(false);
      Alert.alert('Éxito', 'Curso creado correctamente');
      onSave();
      onClose();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Error al crear el curso');
      console.error('Error creating course:', error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.label}>Nombre del curso</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre del curso"
            value={courseName}
            onChangeText={setCourseName}
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la descripción"
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.label}>Duración</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la duración"
            value={duration}
            onChangeText={setDuration}
          />
          <Text style={styles.label}>Categoría</Text>
          <Picker
            selectedValue={categoryId}
            style={styles.picker}
            onValueChange={(itemValue) => setCategoryId(itemValue)}
          >
            <Picker.Item label="Seleccione una categoría" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.NombreCategoria} value={category.id} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateCourse} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Crear Curso</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FabModal;
