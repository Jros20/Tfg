import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ClassCard = ({ clase }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ClaseDetail', { classId: clase.id });
  };

  return (
    <TouchableOpacity style={styles.classCard} onPress={handlePress}>
      <Image source={{ uri: clase.imageUrl }} style={styles.classImage} />
      <View style={styles.classDetails}>
        <Text style={styles.className}>Clase: {clase.id}</Text>
        <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
        <Text style={styles.classAttachedFiles}>Archivos Adjuntos: {clase.attachedFiles.length}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  classCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: 'row',
  },
  classImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  classDuration: {
    fontSize: 14,
    marginBottom: 10,
  },
  classAttachedFiles: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ClassCard;
