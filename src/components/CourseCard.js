import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { doc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/firebase';

const CourseCard = ({ course }) => {
  const [categoryName, setCategoryName] = useState('');
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categoryDoc = await getDoc(doc(db, 'Categorias', course.categoryId));
        if (categoryDoc.exists()) {
          setCategoryName(categoryDoc.data().NombreCategoria); // Asegúrate de que el campo coincida con el de Firestore
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
        const enrollmentQuery = query(collection(db, 'Inscripciones'), where('courseId', '==', course.id));
        const enrollmentQuerySnapshot = await getDocs(enrollmentQuery);
        setEnrollmentCount(enrollmentQuerySnapshot.size);
      } catch (error) {
        console.error('Error fetching enrollment count:', error);
      }
    };

    fetchCategoryName();
    fetchEnrollmentCount();
  }, [course.categoryId, course.id]);

  return (
    <View key={course.id} style={styles.courseCard}>
      <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
      <View style={styles.courseDetails}>
        <Text style={styles.courseName}>{course.courseName}</Text>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <Text style={styles.courseDuration}>Duración: {course.duration}</Text>
        <Text style={styles.courseCategory}>Categoría: {categoryName}</Text>
        <Text style={styles.enrollmentCount}>Inscritos: {enrollmentCount}</Text>
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
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
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
});

export default CourseCard;
