import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from '../components/Footer';
import StudentCard from '../components/StudentCard';
import { Picker } from '@react-native-picker/picker';

const studentsData = [
  { id: '1', name: 'Juan Antonio', email: 'juan.antonio@example.com', category: 'Matemáticas' },
  { id: '2', name: 'Maria Garcia', email: 'maria.garcia@example.com', category: 'Física' },
  { id: '3', name: 'Luis Fernandez', email: 'luis.fernandez@example.com', category: 'Química' },
];

const categories = ['Todas', 'Matemáticas', 'Física', 'Química'];

const StudentSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [filteredStudents, setFilteredStudents] = useState(studentsData);

  const handleSearch = (text) => {
    setSearchText(text);
    filterStudents(text, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterStudents(searchText, category);
  };

  const filterStudents = (text, category) => {
    const filtered = studentsData.filter(student =>
      (category === 'Todas' || student.category === category) &&
      (student.name.toLowerCase().includes(text.toLowerCase()) ||
       student.id.includes(text))
    );
    setFilteredStudents(filtered);
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Alumnos</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre o ID"
        value={searchText}
        onChangeText={handleSearch}
      />

      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={handleCategoryChange}
      >
        {categories.map(category => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <Footer />
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
  searchInput: {
    margin: 16,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default StudentSearchScreen;
