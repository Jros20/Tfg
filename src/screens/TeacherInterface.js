import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const UserInterface = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [fabModalVisible, setFabModalVisible] = useState(false);
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

  const openFabModal = () => {
    setFabModalVisible(true);
  };

  const closeFabModal = () => {
    setFabModalVisible(false);
  };

  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
  };

  const navigateToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  const navigateToCalendarScreen = () => {
    navigation.navigate('CalendarScreen');
  };

  const navigateToSearchScreen = () => {
    navigation.navigate('SearchScreen');
  };

  const handleMenuItemPress = (item) => {
    if (item.name === 'DETALLES USUARIO') {
      closeModal();
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } else if (item.name === 'METODO DE PAGO') {
      navigation.navigate('MetodoPago');
    }
  };

  const courses = [
    { id: 1, name: 'MATEMATICAS 1', inscritos: 1 },
    { id: 2, name: 'MATEMATICAS 2', inscritos: 1 },
    { id: 3, name: 'MATEMATICAS 3', inscritos: 1 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>PORTAL DEL PROFESOR</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={navigateToSearchScreen}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseText}>INSCRITOS: {course.inscritos}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={navigateToChatScreen}>
          <Icon name="comments" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={navigateToCalendarScreen}>
          <Icon name="book" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fab} onPress={openFabModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

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
            {courses.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItemContainer} onPress={() => handleMenuItemPress(item)}>
                <Text style={styles.menuItem}>{item.name}</Text>
                <View style={styles.separator} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

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
              { top: userIconPosition.y - 800, left: userIconPosition.x + 10 },
            ]}
          />
          <View
            style={[
              styles.profileModalContent,
              { top: userIconPosition.y - 790, left: userIconPosition.x - 160 },
            ]}
          >
            <TouchableOpacity style={styles.profileModalButton} onPress={() => { /* Implementar funcionalidad de cierre de sesión aquí */ }}>
              <Text style={styles.profileModalButtonText}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileModalButton} onPress={navigateToUserDetail}>
              <Text style={styles.profileModalButtonText}>VER DETALLES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={fabModalVisible}
        animationType="slide"
        onRequestClose={closeFabModal}
      >
        <View style={styles.fabModalOverlay}>
          <View style={styles.fabModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeFabModal}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollContainer: {
    padding: 16,
    alignItems: 'center', // Centramos el contenido horizontalmente
  },
  courseCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    width: '90%', // Ajustamos el ancho al 90% de la pantalla
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseText: {
    fontSize: 16,
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
    right: 20,
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
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  profileModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: 700,
  },
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

export default UserInterface;
