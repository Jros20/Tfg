import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CursoItemCard = ({ course }) => {
  return (
    <View style={[styles.card, styles.verticalCard]}>
      <Image source={{ uri: course.imageUrl }} style={styles.cardImage} />
      <Text style={styles.cardText}>{course.courseName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginRight: 16,
  },
  verticalCard: {
    width: width * 0.9,
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CursoItemCard;
