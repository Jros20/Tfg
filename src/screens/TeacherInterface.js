import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';
import TeacherInfoModal from '../components/TeacherInfoModal';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const { width } = Dimensions.get('window');

const TeacherInterface = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  const checkTutorInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const tutorDocRef = doc(db, 'Tutores', user.uid);
      const tutorDoc = await getDoc(tutorDocRef);

      if (!tutorDoc.exists() || !tutorDoc.data().edad || !tutorDoc.data().telefono || !tutorDoc.data().tarifas || !tutorDoc.data().especializaciones) {
        setInfoModalVisible(true);
      } else {
        setInfoModalVisible(false); // Asegurarse de que el modal no esté visible si la información ya está completa
      }
    }
  };

  useEffect(() => {
    checkTutorInfo();
  }, []);

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

  const navigateToLogin = () => {
    closeProfileModal();
    navigation.navigate('LoginScreen');
  };

  const navigateToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  const navigateToCalendarScreen = () => {
    navigation.navigate('CalendarScreen');
  };

  const navigateToSearchScreen = () => {
    navigation.navigate('StudentSearchScreen'); // Actualizado para llevar a StudentSearchScreen
  };

  const navigateToProfesorDetail = () => {
    navigation.navigate('ProfesorDetail');
  };

  const handleMenuItemPress = (item) => {
    if (item.name === 'DETALLES USUARIO') {
      closeModal();
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } else if (item.name === 'METODO DE PAGO') {
      navigation.navigate('MetodoPago');
    } else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 2, name: 'METODO DE PAGO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

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
          <TouchableOpacity key={course.id} style={styles.courseCard} onPress={navigateToProfesorDetail}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseText}>INSCRITOS: {course.inscritos}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer />

      <TouchableOpacity style={styles.fab} onPress={openFabModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

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
        navigateToLogin={navigateToLogin}
      />

      <TeacherInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        onSave={() => {
          setInfoModalVisible(false);
          navigation.navigate('TeacherInterface');
        }}
      />

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
    alignItems: 'center',
  },
  courseCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    width: '90%',
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

export default TeacherInterface;
