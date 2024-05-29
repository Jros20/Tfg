import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessageModal = ({ visible, onClose, onSend }) => {
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [message, setMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const profesores = [
    { id: 1, name: 'PROFE MATES 1' },
    { id: 2, name: 'PROFE MATES 2' },
    { id: 3, name: 'PROFE MATES 3' },
    { id: 4, name: 'PROFE MATES 4' },
  ];

  const handleSend = () => {
    onSend(selectedProfesor, message);
    setMessage('');
    onClose();
  };

  const handleSelectProfesor = (profesor) => {
    setSelectedProfesor(profesor);
    setDropdownVisible(false);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Enviar Mensaje</Text>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.pickerText}>
              {selectedProfesor ? selectedProfesor.name : 'Selecciona un profesor'}
            </Text>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownContainer}>
              <FlatList
                data={profesores}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectProfesor(item)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative', // Ajustamos la posición para permitir el posicionamiento absoluto del botón
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10000, // Ajustamos el zIndex para asegurarnos de que esté por encima de todo
  },
  pickerText: {
    fontSize: 16,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '50%', // Colocamos el menú desplegable debajo del botón
    left: 50,
    width: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
    elevation: 10, // Ajustamos la elevación para que esté por encima de todo
    zIndex: 9999, // Establecemos un alto valor de zIndex para asegurar la superposición
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10, // Añadimos margen superior para separar el botón del menú desplegable
    elevation: 10, // Ajustamos la elevación para que esté por encima del menú desplegable
     // Ajustamos el zIndex para asegurarnos de que esté por encima de todo
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MessageModal;
