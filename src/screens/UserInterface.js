// App.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

const UserInterface = () => {
  const courses = [
    { id: 1, name: 'MATEMATICAS 1' },
    { id: 2, name: 'MATEMATICAS 2' },
    { id: 3, name: 'MATEMATICAS 3' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>MIS CURSOS</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Text>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Text>👤</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <Text style={styles.courseText}>{course.name}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>📚</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
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
  scrollContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
  },
  courseText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    padding: 10,
  },
});

export default UserInterface;