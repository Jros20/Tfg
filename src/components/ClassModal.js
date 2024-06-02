import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Clase from '../model/Clase';

const ClassModal = ({ visible, onClose, courseName, onSave }) => {
  const [duration, setDuration] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [courseDescription, setCourseDescription] = useState(''); // Nuevo campo para la descripción

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setVideoUri(result.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const pickFiles = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (result.type === 'success') {
      setAttachedFiles(prevFiles => [...prevFiles, result.uri]);
    }
  };

  const handleSave = async () => {
    try {
      if (!courseName || !duration) {
        throw new Error('Course name and duration are required');
      }
      await Clase.create(courseName, duration, videoUri, imageUri, attachedFiles, courseDescription); // Añadido campo de descripción
      onSave();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la clase');
      console.error('Error saving class:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Crear Clase</Text>
          <TextInput
            style={styles.input}
            placeholder="Duración"
            value={duration}
            onChangeText={setDuration}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción del Curso" // Campo para la descripción del curso
            value={courseDescription}
            onChangeText={setCourseDescription}
          />
          <Button title="Seleccionar Video" onPress={pickVideo} />
          {videoUri && <Text style={styles.fileName}>Video seleccionado</Text>}
          <Button title="Seleccionar Imagen" onPress={pickImage} />
          {imageUri && <Text style={styles.fileName}>Imagen seleccionada</Text>}
          <Button title="Seleccionar Archivos Adjuntos" onPress={pickFiles} />
          {attachedFiles.length > 0 && (
            <View>
              {attachedFiles.map((file, index) => (
                <Text key={index} style={styles.fileName}>
                  {file.split('/').pop()}
                </Text>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar Clase</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileName: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ClassModal;
