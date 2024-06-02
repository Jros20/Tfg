import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import ClassModal from '../components/ClassModal';
import Clase from '../model/Clase';
import { db, auth } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfesorDetail = ({ route }) => {
  const { courseName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const fetchClases = async () => {
      const q = query(collection(db, 'Clases'), where('courseName', '==', courseName));
      const querySnapshot = await getDocs(q);
      const fetchedClases = [];
      querySnapshot.forEach((doc) => {
        fetchedClases.push({ id: doc.id, ...doc.data() });
      });
      setClases(fetchedClases);
    };

    fetchClases();
  }, [courseName]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    // Refresh classes after save
    fetchClases();
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
        {clases.map((clase) => (
          <TouchableOpacity
            key={clase.id}
            style={styles.classCard}
            onPress={() => navigation.navigate('ClaseDetail', { className: clase.id })}
          >
            <Image source={{ uri: clase.imageUrl }} style={styles.classImage} />
            <View style={styles.classDetails}>
              <Text style={styles.className}>Clase: {clase.id}</Text>
              <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
              <Text style={styles.classAttachedFiles}>Archivos Adjuntos: {clase.attachedFiles}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <ClassModal
        visible={modalVisible}
        onClose={closeModal}
        courseName={courseName}
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
