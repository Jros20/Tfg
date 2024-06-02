import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { db, collection, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../utils/firebase';

const ClassModal = ({ visible, onClose, courseId, onSave }) => {
  const [duration, setDuration] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setImageUri(result.assets[0].uri);
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
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleCreateClass = async () => {
    if (!duration || !videoUri || !imageUri) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      console.log('courseId:', courseId);
      if (!courseId) {
        console.error('courseId is undefined');
        return;
      }

      const videoRef = ref(storage, `classVideos/${courseId}/${Date.now()}`);
      const videoBlob = await (await fetch(videoUri)).blob();
      const videoUploadTask = uploadBytesResumable(videoRef, videoBlob);
      await videoUploadTask;
      const videoUrl = await getDownloadURL(videoRef);
      console.log('Video uploaded:', videoUrl);

      const imageRef = ref(storage, `classImages/${courseId}/${Date.now()}`);
      const imageBlob = await (await fetch(imageUri)).blob();
      const imageUploadTask = uploadBytesResumable(imageRef, imageBlob);
      await imageUploadTask;
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image uploaded:', imageUrl);

      const uploadedFiles = [];
      for (let file of attachedFiles) {
        console.log('Uploading file:', file.name);
        const fileRef = ref(storage, `classFiles/${courseId}/${Date.now()}_${file.name}`);
        const fileBlob = await (await fetch(file.uri)).blob();
        const fileUploadTask = uploadBytesResumable(fileRef, fileBlob);
        await fileUploadTask;
        const fileUrl = await getDownloadURL(fileRef);
        console.log('File uploaded:', fileUrl);
        uploadedFiles.push({ name: file.name, url: fileUrl });
      }

      console.log('Adding class to Firestore...');
      await addDoc(collection(db, 'Clases'), {
        courseId,
        duration,
        videoUrl,
        imageUrl,
        attachedFiles: uploadedFiles,
      });

      console.log('Class created successfully');
      Alert.alert('Éxito', 'Clase creada correctamente');
      onSave();
      onClose();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Error al crear la clase');
      console.error('Error creating class:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.label}>Duración</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la duración"
            value={duration}
            onChangeText={setDuration}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
            {videoUri ? (
              <Text style={styles.videoPickerText}>Video seleccionado</Text>
            ) : (
              <Text style={styles.videoPickerText}>Seleccionar Video</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateClass} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Crear Clase</Text>}
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

export default ClassModal;
