import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import ClassModal from '../components/ClassModal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

const ProfesorDetail = ({ route }) => {
  const { courseId, courseName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [clases, setClases] = useState([]);
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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    await fetchClases();
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
                <Text style={styles.className}>Clase: {clase.id}</Text>
                <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
                <Text style={styles.classAttachedFiles}>Archivos Adjuntos: {clase.attachedFiles.length}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <ClassModal
        visible={modalVisible}
        onClose={closeModal}
        courseId={courseId}
        onSave={handleSave}
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
  classAttachedFiles: {
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
});

export default ProfesorDetail;
