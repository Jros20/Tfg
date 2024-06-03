import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, query, where, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../utils/firebase';

const CourseCard = ({ course }) => {
  const [categoryName, setCategoryName] = useState('');
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [courses, setCourses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categoryDoc = await getDoc(doc(db, 'Categorias', course.categoryId));
        if (categoryDoc.exists()) {
          setCategoryName(categoryDoc.data().NombreCategoria);
        } else {
          setCategoryName('Sin categoría');
        }
      } catch (error) {
        console.error('Error fetching category name:', error);
        setCategoryName('Error al cargar categoría');
      }
    };

    const fetchEnrollmentCount = async () => {
      try {
        const enrollmentQuery = query(collection(db, 'Inscripciones'), where('cursoId', '==', course.courseId));
        const enrollmentQuerySnapshot = await getDocs(enrollmentQuery);
        setEnrollmentCount(enrollmentQuerySnapshot.size);
      } catch (error) {
        console.error('Error fetching enrollment count:', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesQuerySnapshot = await getDocs(collection(db, 'Cursos'));
        const coursesData = coursesQuerySnapshot.docs.map(doc => ({
          courseId: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCategoryName();
    fetchEnrollmentCount();
    fetchUserRole();
    fetchCourses();
  }, [course.categoryId, course.courseId]);

  const handlePress = () => {
    console.log('Document ID:', course.courseId);
    navigation.navigate('ProfesorDetail', { courseId: course.courseId });
  };

  const deleteCourse = async () => {
    try {
      await deleteDoc(doc(db, 'Cursos', course.courseId));
      Alert.alert('Curso eliminado', 'El curso ha sido eliminado correctamente.');
      // Refresh the list of courses after deletion
      const updatedCourses = await fetchCourses();
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting course:', error);
      Alert.alert('Error', 'Hubo un error al eliminar el curso.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar curso',
      '¿Estás seguro de que quieres eliminar este curso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: deleteCourse, style: 'destructive' }
      ]
    );
  };

  const fetchCourses = async () => {
    try {
      const coursesQuerySnapshot = await getDocs(collection(db, 'Cursos'));
      const coursesData = coursesQuerySnapshot.docs.map(doc => ({
        courseId: doc.id,
        ...doc.data()
      }));
      return coursesData;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  };

  return (
    <View key={course.courseId} style={styles.courseCard}>
      <TouchableOpacity onPress={handlePress} style={styles.courseImageContainer}>
        <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
      </TouchableOpacity>
      <View style={styles.courseDetails}>
        <Text style={styles.courseName}>{course.courseName}</Text>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <Text style={styles.courseDuration}>Duración: {course.duration}</Text>
        <Text style={styles.courseCategory}>Categoría: {categoryName}</Text>
        <Text style={styles.enrollmentCount}>Inscritos: {enrollmentCount}</Text>
        {userRole === 'PROFESOR' && (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: 'row',
  },
  courseImageContainer: {
    marginRight: 20,
  },
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  courseDuration: {
    fontSize: 14,
    marginBottom: 10,
  },
  courseCategory: {
    fontSize: 14,
    marginBottom: 10,
  },
  enrollmentCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6666',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CourseCard;
