import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

const ClassCard = ({ clase, onPress }) => {
  return (
    <TouchableOpacity style={styles.classCard} onPress={onPress}>
      <Image source={{ uri: clase.imageUrl }} style={styles.classImage} />
      <View style={styles.classDetails}>
        <Text style={styles.className}>Clase: {clase.className}</Text>
        <Text style={styles.classDuration}>Duración: {clase.duration}</Text>
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
});

export default ClassCard;
