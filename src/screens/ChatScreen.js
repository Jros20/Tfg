import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';
import ContactCard from '../components/ContactCard';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [userRole, setUserRole] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [contacts, setContacts] = useState([]);
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileImage(userData.profileImage || userData.fotoPerfil);
            setUserRole(userData.role);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          if (userRole === 'PROFESOR') {
            // Obtener cursos del profesor
            const coursesQuery = query(collection(db, 'Cursos'), where('tutorId', '==', user.uid));
            const coursesSnapshot = await getDocs(coursesQuery);

            const courseIds = coursesSnapshot.docs.map(doc => doc.data().courseId);

            // Obtener inscripciones de los cursos del profesor
            const enrollmentsQuery = query(collection(db, 'Inscripciones'), where('cursoId', 'in', courseIds));
            const enrollmentSnapshot = await getDocs(enrollmentsQuery);

            const studentIds = [...new Set(enrollmentSnapshot.docs.map(doc => doc.data().estudianteId))];

            // Obtener detalles de los estudiantes
            const studentsQuery = query(collection(db, 'users'), where('uid', 'in', studentIds));
            const studentsSnapshot = await getDocs(studentsQuery);

            const studentsData = studentsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setContacts(studentsData);
          } else {
            // Obtener inscripciones del usuario
            const enrollmentsQuery = query(collection(db, 'Inscripciones'), where('estudianteId', '==', user.uid));
            const enrollmentSnapshot = await getDocs(enrollmentsQuery);

            const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().cursoId);

            // Obtener detalles de los cursos
            const coursesQuery = query(collection(db, 'Cursos'), where('courseId', 'in', courseIds));
            const coursesSnapshot = await getDocs(coursesQuery);

            const tutorIds = [...new Set(coursesSnapshot.docs.map(doc => doc.data().tutorId))];

            // Obtener detalles de los profesores
            const professorsQuery = query(collection(db, 'users'), where('uid', 'in', tutorIds));
            const professorsSnapshot = await getDocs(professorsQuery);

            const professorsData = professorsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setContacts(professorsData);
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    if (userRole) {
      fetchContacts();
    }
  }, [userRole]);

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
      if (userRole === 'PROFESOR') {
        navigation.navigate('TeacherInterface');
      } else {
        navigation.navigate('UserInterface');
      }
    } else if (item.name === 'TERMINOS Y CONDICIONES') {
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
        <Text style={styles.title}>CHAT</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
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

      <FlatList
        data={contacts}
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default ChatScreen;
