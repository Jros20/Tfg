import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CourseCard = ({ course }) => {
  return (
    <View key={course.id} style={styles.courseCard}>
      <Text style={styles.courseText}>{course.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
  },
  courseText: {
    fontSize: 16,
  },
});

export default CourseCard;
