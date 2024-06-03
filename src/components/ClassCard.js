import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDoc, doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const ClassCard = ({ clase }) => {
  const [userRole, setUserRole] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const handlePress = () => {
    console.log(`ClassCard pressed with classId: ${clase.id}`);
    // Aquí puedes añadir lógica adicional para manejar la pulsación del botón si es necesario
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar clase',
      '¿Estás seguro de que quieres eliminar esta clase?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: handleDelete, style: 'destructive' }
      ]
    );
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'Clases', clase.id));
      console.log(`Class with ID ${clase.id} deleted`);
      setIsDeleted(true); // Marcar la clase como eliminada
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  if (isDeleted) {
    return null; // No renderizar nada si la clase ha sido eliminada
  }

  return (
    <TouchableOpacity style={styles.classCard} onPress={handlePress}>
      <Image source={{ uri: clase.imageUrl }} style={styles.classImage} />
      <View style={styles.classDetails}>
        <Text style={styles.className}>Clase: {clase.className}</Text>
        <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
        {userRole === 'PROFESOR' && (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Icon name="trash" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6666',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ClassCard;
