import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const TeacherInfoModal = ({ visible, onClose, onSave }) => {
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [tarifas, setTarifas] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
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

  const toggleSpecialization = (specialization) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization)
        ? prev.filter((i) => i !== specialization)
        : [...prev, specialization]
    );
  };

  const handleSave = async () => {
    if (!age || !phone || !tarifas || selectedSpecializations.length === 0) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    try {
      const user = auth.currentUser;
      const tutorDocRef = doc(db, 'Tutores', user.uid);

      // Guardar información del tutor
      await setDoc(tutorDocRef, {
        edad: age,
        telefono: phone,
        tarifas: tarifas,
        especializaciones: selectedSpecializations
      }, { merge: true });

      Alert.alert('Éxito', 'Información guardada exitosamente.');
      onSave(); // Notificar a TeacherInterface que la información ha sido guardada
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información.');
      console.error('Error al guardar la información del tutor:', error);
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
          <TextInput
            style={styles.input}
            placeholder="Tarifas"
            value={tarifas}
            onChangeText={setTarifas}
          />

          <Text style={styles.subtitle}>Selecciona tus especializaciones</Text>
          <ScrollView contentContainerStyle={styles.interestsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.interestButton,
                  selectedSpecializations.includes(category.id) && styles.selectedInterestButton
                ]}
                onPress={() => toggleSpecialization(category.id)}
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

export default TeacherInfoModal;
