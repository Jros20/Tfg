import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ClassCard from '../components/ClassCard';
import ClassModal from '../components/ClassModal';
import Clase from '../model/Clase';
import Footer from '../components/Footer';
import ProfileModal from '../components/ProfileModal';
import { db, auth } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import User from '../model/User';

const { width } = Dimensions.get('window');

const ProfesorDetail = () => {
  const route = useRoute();
  const { courseId } = route.params;
  console.log('Route Params:', route.params); // Log route params
  console.log('Course ID:', courseId); // Log courseId

  const [courseName, setCourseName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [clases, setClases] = useState([]);
  const [className, setClassName] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();
  const [documentos, setDocumentos] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = User.fromFirestore(userDoc);
          setUserRole(userData.role);
          setProfileImage(userData.fotoPerfil);
        }
      }
    };

    fetchUserProfile();
  }, []);

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
  
  useEffect(() => {
    const fetchClases = async () => {
      try {
        if (!courseId) {
          console.error('courseId is undefined');
          return;
        }
        const fetchedClases = await Clase.fetchClases(courseId);
        setClases(fetchedClases);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClases();
  }, [courseId]);

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'Cursos', courseId));
        if (courseDoc.exists()) {
          setCourseName(courseDoc.data().courseName);
          console.log('Course Name:', courseDoc.data().courseName); // Log course name
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course name:', error);
      }
    };

    fetchCourseName();
  }, [courseId]);

  const handleCreateClass = async () => {
    if (!className || !duration || !image) {
      Alert.alert('Error', 'Asegúrese de que todos los campos obligatorios están completos.');
      return;
    }
    if (!Clase.isValidUrl(documentos)) {
      Alert.alert('Error', 'No se ha podido crear la clase porque documentos no era una URL válida.');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await Clase.uploadFile(image, 'image', courseId);
      const videoUrl = video ? await Clase.uploadFile(video, 'video', courseId) : null;

      const newClass = new Clase({
        id: null,
        courseId,
        className,
        duration,
        imageUrl,
        videoUrl,
        documentos,
      });

      await newClass.save();
      Alert.alert('Éxito', 'Clase creada con éxito');
      const fetchedClases = await Clase.fetchClases(courseId);
      setClases(fetchedClases);
      closeModal();
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'No se pudo crear la clase.');
    } finally {
      setUploading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setClassName('');
    setDuration('');
    setDocumentos('');
    setImage(null);
    setVideo(null);
  };

  const pickImage = async () => {
    const result = await Clase.pickImage();
    if (result) setImage(result);
  };

  const pickVideo = async () => {
    const result = await Clase.pickVideo();
    if (result) setVideo(result);
  };

  const handleClassCardPress = (classId) => {
    console.log(`Navigating to ClaseDetail with classId: ${classId}`);
    navigation.navigate('ClaseDetail', { classId });
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

  const handleBackPress = () => {
    if (userRole === 'PROFESOR') {
      navigation.navigate('TeacherInterface');
    } else {
      navigation.navigate('UserInterface');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
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
        <Text style={styles.courseNameText}>{courseName}</Text>
        {clases.length === 0 ? (
          <View style={styles.noClassesContainer}>
            <Text style={styles.noClassesText}>Se subirán clases próximamente</Text>
          </View>
        ) : (
          clases.map((clase) => (
            <ClassCard
              key={clase.id}
              clase={clase}
              onPress={handleClassCardPress} // Pasamos la función de navegación aquí
            />
          ))
        )}
      </ScrollView>

      {userRole === 'PROFESOR' && (
        <TouchableOpacity style={styles.fab} onPress={openModal}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <Footer />

      <ClassModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        className={className}
        setClassName={setClassName}
        duration={duration}
        setDuration={setDuration}
        documentos={documentos}
        setDocumentos={setDocumentos}
        image={image}
        pickImage={pickImage}
        video={video}
        pickVideo={pickVideo}
        handleCreateClass={handleCreateClass}
        uploading={uploading}
      />

      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
        navigateToUserDetail={() => navigation.navigate('UserDetail')}
        navigateToLogin={() => navigation.navigate('LoginScreen')}
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
  backButton: {
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
  courseNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noClassesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noClassesText: {
    fontSize: 18,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfesorDetail;
