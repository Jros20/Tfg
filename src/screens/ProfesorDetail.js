import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import * as ImagePicker from 'expo-image-picker';
import ClassCard from '../components/ClassCard';
import ClassModal from '../components/ClassModal';
import Clase from '../model/Clase';
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

  useEffect(() => {
    const fetchClases = async () => {
      try {
        if (!courseId) {
          console.error('courseId is undefined');
          return;
        }
        const fetchedClases = await Clase.fetchClases(courseId);
        setClases(fetchedClases);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClases();
  }, [courseId]);

  const handleCreateClass = async () => {
    if (!className || !duration || !image) {
      Alert.alert('Error', 'Asegúrese de que todos los campos obligatorios están completos.');
      return;
    }
    if (!Clase.isValidUrl(documentos)) {
      Alert.alert('Error', 'No se ha podido crear la clase porque documentos no era una URL válida.');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await Clase.uploadFile(image, 'image', courseId);
      const videoUrl = video ? await Clase.uploadFile(video, 'video', courseId) : null;

      const newClass = new Clase({
        id: null,
        courseId,
        className,
        duration,
        imageUrl,
        videoUrl,
        documentos,
      });

      await newClass.save();
      Alert.alert('Éxito', 'Clase creada con éxito');
      const fetchedClases = await Clase.fetchClases(courseId);
      setClases(fetchedClases);
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

  const pickImage = async () => {
    const result = await Clase.pickImage();
    if (result) setImage(result);
  };

  const pickVideo = async () => {
    const result = await Clase.pickVideo();
    if (result) setVideo(result);
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
