import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';
import CourseCard from '../components/CourseCard';
import StudentInfoModal from '../components/StudentInfoModal';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const UserInterface = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [profileImage, setProfileImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const userIconRef = useRef(null);
  const navigation = useNavigation();
  const user = auth.currentUser;

  const checkStudentInfo = async () => {
    if (user) {
      const studentDocRef = doc(db, 'Estudiantes', user.uid);
      const studentDoc = await getDoc(studentDocRef);

      if (!studentDoc.exists() || !studentDoc.data().edad || !studentDoc.data().telefono || !studentDoc.data().intereses) {
        setInfoModalVisible(true);
      } else {
        setInfoModalVisible(false); // Asegurarse de que el modal no esté visible si la información ya está completa
      }
    }
  };

  const fetchUserProfileImage = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      }
    }
  };

  const fetchCourses = async () => {
    try {
      if (user) {
        const enrollmentsQuery = query(collection(db, 'Inscripciones'), where('estudianteId', '==', user.uid));
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        const courseIds = enrollmentsSnapshot.docs.map(doc => doc.data().cursoId);

        const coursePromises = courseIds.map(courseId => getDoc(doc(db, 'Cursos', courseId)));
        const courseDocs = await Promise.all(coursePromises);

        const coursesData = courseDocs.map(courseDoc => ({
          courseId: courseDoc.id,
          ...courseDoc.data()
        }));
        
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching user courses:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkStudentInfo();
      fetchUserProfileImage();
      fetchCourses();
    }, [])
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openProfileModal = () => {
    userIconRef.current.measure((fx, fy, width, height, px, py) => {
      setUserIconPosition({ x: px, y: py + height });
      setProfileModalVisible(true);
    });
  };
  const closeProfileModal = () => setProfileModalVisible(false);

  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>MIS CURSOS</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchScreen')}>
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
          <CourseCard key={course.courseId} course={course} />
        ))}
      </ScrollView>
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

      <StudentInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        onSave={() => {
          setInfoModalVisible(false);
          navigation.navigate('UserInterface');
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
  },
});

export default UserInterface;
