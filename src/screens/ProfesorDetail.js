import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ProfesorDetail = () => {
  const route = useRoute();
  const { courseId, courseName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [clases, setClases] = useState([]);
  const [className, setClassName] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const fetchClases = async () => {
    try {
      if (!courseId) {
        console.error('courseId is undefined');
        return;
      }
      console.log('Fetching classes for courseId:', courseId);
      const q = query(collection(db, 'Clases'), where('courseId', '==', courseId));
      const querySnapshot = await getDocs(q);
      const fetchedClases = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedClases.push({ id: doc.id, ...data });
      });
      if (fetchedClases.length === 0) {
        console.log('No hay clases todavía');
      }
      setClases(fetchedClases);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClases();
  }, [courseId]);

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setImage(uri);
    } else {
      console.log('No valid image selected');
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setVideo(uri);
    } else {
      console.log('No valid video selected');
    }
  };

  const uploadFile = async (uri, fileType) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `${fileType}s/${courseId}/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Puedes manejar el progreso de la subida aquí si lo deseas
          },
          (error) => {
            console.error(`Error during ${fileType} upload: `, error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
  };

  const handleCreateClass = async () => {
    if (!className || !duration || !image) {
      Alert.alert('Error', 'El nombre de la clase, la duración y la imagen son obligatorias.');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadFile(image, 'image');
      const videoUrl = video ? await uploadFile(video, 'video') : null;

      // Crear una referencia a una nueva clase en la colección 'Clases'
      const classRef = doc(collection(db, 'Clases'));
      const classId = classRef.id;

      // Guardar la nueva clase en Firestore
      await setDoc(classRef, {
        classId: classId,
        courseId: courseId,
        className: className,
        duration: duration,
        imageUrl: imageUrl,
        videoUrl: videoUrl, // Almacenar la URL del video si existe
      });

      Alert.alert('Éxito', 'Clase creada con ID: ' + classId);
      await fetchClases(); // Actualizar la lista de clases después de crear una nueva clase
      closeModal();
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'No se pudo crear la clase.');
    } finally {
      setUploading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setClassName('');
    setDuration('');
    setImage(null);
    setVideo(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{courseName}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {clases.length === 0 ? (
          <View style={styles.noClassesContainer}>
            <Text style={styles.noClassesText}>Se subirán clases próximamente</Text>
          </View>
        ) : (
          clases.map((clase) => (
            <TouchableOpacity
              key={clase.id}
              style={styles.classCard}
              onPress={() => navigation.navigate('ClaseDetail', { classId: clase.id })}
            >
              <Image source={{ uri: clase.imageUrl }} style={styles.classImage} />
              <View style={styles.classDetails}>
                <Text style={styles.className}>Clase: {clase.className}</Text>
                <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.label}>Nombre de la Clase</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre de la clase"
              value={className}
              onChangeText={setClassName}
            />
            <Text style={styles.label}>Duración de la Clase</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la duración"
              value={duration}
              onChangeText={setDuration}
            />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
              {video ? (
                <Text style={styles.videoPickerText}>Video seleccionado</Text>
              ) : (
                <Text style={styles.videoPickerText}>Seleccionar Video</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateClass} disabled={uploading}>
              {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Crear Clase</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContainer: {
    padding: 16,
  },
  noClassesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noClassesText: {
    fontSize: 18,
    color: '#666',
  },
  classCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: 'row',
  },
  classImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  classDuration: {
    fontSize: 14,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  videoPicker: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  videoPickerText: {
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

export default ProfesorDetail;

