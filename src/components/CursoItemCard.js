import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Inscripcion from '../model/Inscripcion';

const { width } = Dimensions.get('window');

const CursoItemCard = ({ course }) => {
  const navigation = useNavigation();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [inscripcionId, setInscripcionId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const inscripcion = await Inscripcion.getInscripcion(course.courseId);
        if (inscripcion) {
          setIsEnrolled(true);
          setInscripcionId(inscripcion.inscripcionId);
        } else {
          setIsEnrolled(false);
          setInscripcionId(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkEnrollment();
  }, [course.courseId]);

  const handleInscribirse = async () => {
    setLoading(true);
    try {
      if (isEnrolled) {
        await Inscripcion.delete(inscripcionId);
        setIsEnrolled(false);
        setInscripcionId(null);
      } else {
        const newInscripcion = await Inscripcion.create(course.courseId);
        setIsEnrolled(true);
        setInscripcionId(newInscripcion.inscripcionId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToProfessorDetail = () => {
    navigation.navigate('ProfesorDetail', { courseId: course.courseId });
  };

  return (
    <TouchableOpacity onPress={navigateToProfessorDetail} style={styles.card}>
      <Image source={{ uri: course.imageUrl }} style={styles.cardImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.cardText}>{course.courseName}</Text>
        <TouchableOpacity onPress={handleInscribirse} disabled={loading} style={styles.starButton}>
          <Icon name="star" size={24} color={isEnrolled ? '#FFD700' : '#C0C0C0'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginRight: 16,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  starButton: {
    marginLeft: 10,
  },
});

export default CursoItemCard;
