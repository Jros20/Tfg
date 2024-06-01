import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const StudentInfoModal = ({ visible, onClose }) => {
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Categorias'));
        const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!age || !phone || selectedInterests.length === 0) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    try {
      const user = auth.currentUser;
      const studentDocRef = doc(db, 'Estudiantes', user.uid);

      // Guardar información del estudiante
      await setDoc(studentDocRef, {
        edad: age,
        telefono: phone
      }, { merge: true });

      // Guardar intereses del estudiante
      const batch = db.batch();
      selectedInterests.forEach((interest) => {
        const interestDocRef = doc(collection(db, 'InteresesEstudiantes'));
        batch.set(interestDocRef, {
          idEstudiante: user.uid,
          idCategoria: interest
        });
      });
      await batch.commit();

      Alert.alert('Éxito', 'Información guardada exitosamente.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información.');
      console.error('Error al guardar la información del estudiante:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Completa tu información</Text>

          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.subtitle}>Selecciona tus intereses</Text>
          <ScrollView contentContainerStyle={styles.interestsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(category.id) && styles.selectedInterestButton
                ]}
                onPress={() => toggleInterest(category.id)}
              >
                <Text style={styles.interestText}>{category.NombreCategoria}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  interestButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5,
  },
  selectedInterestButton: {
    backgroundColor: '#ccc',
  },
  interestText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StudentInfoModal;
