import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ClassModal = ({
  modalVisible,
  closeModal,
  className,
  setClassName,
  duration,
  setDuration,
  documentos,
  setDocumentos,
  image,
  pickImage,
  video,
  pickVideo,
  handleCreateClass,
  uploading,
}) => {
  return (
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
          <Text style={styles.label}>Documentos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese url de documentos"
            value={documentos}
            onChangeText={setDocumentos}
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

export default ClassModal;
