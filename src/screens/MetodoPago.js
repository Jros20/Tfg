import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';

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

  const navigateToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    }  else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
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

      <Footer />

      <MenuModal
        visible={modalVisible}
        onClose={closeModal}
        menuItems={menuItems}
        handleMenuItemPress={handleMenuItemPress}
      />
      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
        navigateToUserDetail={navigateToUserDetail}
      />
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
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
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
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  profileModalTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    position: 'absolute',
  },
  profileModalContent: {
    position: 'absolute',
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  profileModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  profileModalButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default MetodoPago;
