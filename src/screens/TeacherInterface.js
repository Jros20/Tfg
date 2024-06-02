import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';
import FabModal from '../components/FabModal';
import CourseCard from '../components/CourseCard';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import Curso from '../model/Curso';

const { width } = Dimensions.get('window');

const TeacherInterface = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
        }
      }
    };

    fetchProfileImage();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const user = auth.currentUser;
      if (user) {
        const fetchedCourses = await Curso.getCoursesByTutor(user.uid);
        setCourses(fetchedCourses);
      }
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  useEffect(() => {
    fetchCourses();
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
      navigation.navigate('TeacherInterface');
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
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Icon name="user" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
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

      <FabModal
        visible={fabModalVisible}
        onClose={closeFabModal}
        onSave={() => {
          setFabModalVisible(false);
          // Actualizar la lista de cursos después de guardar
          fetchCourses();
        }}
      />
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
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    bottom: 80, // Movido hacia arriba
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TeacherInterface;
