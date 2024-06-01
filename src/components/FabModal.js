// FabModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FabModal = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fabModalOverlay}>
        <View style={styles.fabModalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your description"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>CATEGORÍA</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your category"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>IMAGEN</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your image"
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.buttonTextPublish}>PUBLICAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fabModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fabModalContent: {
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
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  publishButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextPublish: {
    color: '#fff',
  },
});

export default FabModal;
