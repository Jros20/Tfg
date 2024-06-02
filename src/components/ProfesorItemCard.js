import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProfesorItemCard = ({ professor }) => {
  return (
    <View style={[styles.professorCard, styles.verticalProfessorCard]}>
      <Image source={{ uri: professor.profileImage }} style={styles.professorImage} />
      <Text style={styles.professorName}>{professor.name}</Text>
      <Text style={styles.professorDescription}>{professor.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  professorCard: {
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginRight: 16,
    padding: 10,
  },
  verticalProfessorCard: {
    width: width * 0.9,
    marginBottom: 16,
  },
  professorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  professorDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProfesorItemCard;
