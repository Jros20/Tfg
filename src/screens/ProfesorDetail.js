import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import ClassCard from '../components/ClassCard';
import ClassModal from '../components/ClassModal';
import Footer from '../components/Footer';

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
  const [documentos, setDocumentos] = useState('');

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

  const isValidUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
      '((([a-zA-Z0-9\\-\\.]+)\\.[a-zA-Z]{2,})|' + // dominio
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // o dirección IP (v4)
      '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' + // puerto y ruta
      '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' + // cadena de consulta
      '(\\#[-a-zA-Z0-9_]*)?$', 'i'); // fragmento
    return !!pattern.test(url);
  }

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
      Alert.alert('Error', 'Asegúrese de que todos los campos obligatorios están completos.');
      return;
    }
    if (!isValidUrl(documentos)) {
      Alert.alert('Error', 'No se ha podido crear la clase porque documentos no era una URL válida.');
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
        documentos: documentos, // Almacenar la URL de los documentos
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
    setDocumentos('');
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
            <ClassCard
              key={clase.id}
              clase={clase}
              onPress={() => navigation.navigate('ClaseDetail', { classId: clase.id })}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <Footer />

      <ClassModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        className={className}
        setClassName={setClassName}
        duration={duration}
        setDuration={setDuration}
        documentos={documentos}
        setDocumentos={setDocumentos}
        image={image}
        pickImage={pickImage}
        video={video}
        pickVideo={pickVideo}
        handleCreateClass={handleCreateClass}
        uploading={uploading}
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
});

export default ProfesorDetail;
