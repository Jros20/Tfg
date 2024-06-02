import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileModal = ({ visible, onClose, userIconPosition }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Navegar a la pantalla de inicio de sesión al cerrar sesión
    navigation.navigate('Home');
    onClose(); // Cerrar el modal después de navegar
  };

  const handleNavigateToUserDetail = () => {
    // Navegar a la pantalla de detalles del usuario
    navigation.navigate('UserDetail');
    onClose(); // Cerrar el modal después de navegar
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.profileModalOverlay}>
        <View
          style={[
            styles.profileModalTriangle,
            { top: userIconPosition.y - 800, left: userIconPosition.x + 10 },
          ]}
        />
        <View
          style={[
            styles.profileModalContent,
            { top: userIconPosition.y - 790, left: userIconPosition.x - 160 },
          ]}
        >
          <TouchableOpacity style={styles.profileModalButton} onPress={handleLogout}>
            <Text style={styles.profileModalButtonText}>CERRAR SESIÓN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileModalButton} onPress={handleNavigateToUserDetail}>
            <Text style={styles.profileModalButtonText}>VER DETALLES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  profileModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    position: 'absolute',
  },
  profileModalContent: {
    width: 200,
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
  },
  profileModalButton: {
    width: '100%', // Asegura que los botones tengan el mismo ancho
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center', // Centra el texto dentro del botón
  },
  profileModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:12,
  },
  overlay: {
    flex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: 700,
  },
});

export default ProfileModal;
