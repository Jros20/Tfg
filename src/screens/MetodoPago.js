import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MetodoPago = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const openProfileModal = () => {
    userIconRef.current.measure((fx, fy, width, height, px, py) => {
      setUserIconPosition({ x: px, y: py + height });
      setProfileModalVisible(true);
    });
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
  };

  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
  };

  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    }
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 2, name: 'METODO DE PAGO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>METODO DE PAGO</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerInside}>
        <View style={styles.profileImageContainer}>
          <Icon name="credit-card" size={100} color="#000" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN</Text>
          <TextInput
            style={styles.input}
            value="8999-78298-8278-3892"
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>FECHA EXPIRACION</Text>
          <TextInput
            style={styles.input}
            value="28/04"
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>NUMERO SECRETO</Text>
          <TextInput
            style={styles.input}
            value="CVC"
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>EDITAR INFORMACIÓN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="comments" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="book" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateX }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="bars" size={24} color="#000" />
            </TouchableOpacity>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItemContainer} onPress={() => handleMenuItemPress(item)}>
                <Text style={styles.menuItem}>{item.name}</Text>
                <View style={styles.separator} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Modal */}
      <Modal
        transparent={true}
        visible={profileModalVisible}
        animationType="fade"
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.profileModalOverlay}>
          <View
            style={[
              styles.profileModalTriangle,
              { top: userIconPosition.y - 10, left: userIconPosition.x + 10 },
            ]}
          />
          <View
            style={[
              styles.profileModalContent,
              { top: userIconPosition.y + 10, left: userIconPosition.x - 160 },
            ]}
          >
            <TouchableOpacity style={styles.profileModalButton} onPress={() => { /* Implement logout functionality here */ }}>
              <Text style={styles.profileModalButtonText}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileModalButton} onPress={navigateToUserDetail}>
              <Text style={styles.profileModalButtonText}>VER DETALLES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerInside: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    width: '70%',
    height: '100%',
    backgroundColor: '#cccccc',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menuItemContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 10,
  },
  profileModalOverlay: {
    flex: 1,
    position: 'absolute',
  },
  profileModalTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  profileModalContent: {
    position: 'absolute',
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  profileModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  profileModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#a67a73',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MetodoPago;
