import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(10);
  const [visibleProfessors, setVisibleProfessors] = useState(4);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('all');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCourses, setShowCourses] = useState(true);
  const [showProfessors, setShowProfessors] = useState(true);

  useEffect(() => {
    const allCourses = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Curso ${i + 1}`, recent: i < 10, category: i % 3 === 0 ? 'math' : 'science' }));
    const allProfessors = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Profesor ${i + 1}`, description: `Descripción del Profesor ${i + 1}`, image: 'https://via.placeholder.com/150', recent: i < 5, category: i % 2 === 0 ? 'math' : 'science' }));
    setCourses(allCourses);
    setProfessors(allProfessors);
  }, []);

  const loadMoreCourses = () => {
    setVisibleCourses((prev) => Math.min(prev + 10, filteredCourses.length));
  };

  const loadMoreProfessors = () => {
    setVisibleProfessors((prev) => Math.min(prev + 4, filteredProfessors.length));
  };

  const handleFilterChange = () => {
    setVisibleCourses(10);
    setVisibleProfessors(4);
    setIsFilterModalVisible(false);
  };

  const filterItems = (items) => {
    let filtered = items;
    if (filter === 'recent') {
      filtered = filtered.filter((item) => item.recent);
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    return filtered;
  };

  const filteredCourses = filterItems(courses);
  const filteredProfessors = filterItems(professors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Cursos Disponibles</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={() => setIsFilterModalVisible(true)}>
            <Icon name="filter" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isFilterModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar</Text>
            <Text style={styles.modalLabel}>Categoría</Text>
            <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)}>
              <Picker.Item label="Todos" value="all" />
              <Picker.Item label="Matemáticas" value="math" />
              <Picker.Item label="Ciencia" value="science" />
            </Picker>
            <Text style={styles.modalLabel}>Mostrar</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox status={showCourses ? 'checked' : 'unchecked'} onPress={() => setShowCourses(!showCourses)} />
              <Text style={styles.checkboxLabel}>Cursos</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox status={showProfessors ? 'checked' : 'unchecked'} onPress={() => setShowProfessors(!showProfessors)} />
              <Text style={styles.checkboxLabel}>Profesores</Text>
            </View>
            <Button mode="contained" style={styles.modalButton} onPress={handleFilterChange}>
              Aplicar
            </Button>
            <Button mode="outlined" style={styles.modalButton} onPress={() => setIsFilterModalVisible(false)}>
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {showCourses && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CURSOS DISPONIBLES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
              {filteredCourses.slice(0, visibleCourses).map((course) => (
                <View key={course.id} style={styles.card}>
                  <Text style={styles.cardText}>{course.name}</Text>
                </View>
              ))}
              {visibleCourses < filteredCourses.length && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreCourses}>
                  <Icon name="chevron-down" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
        {showProfessors && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESORES DISPONIBLES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
              {filteredProfessors.slice(0, visibleProfessors).map((professor) => (
                <View key={professor.id} style={styles.professorCard}>
                  <Image source={{ uri: professor.image }} style={styles.professorImage} />
                  <Text style={styles.professorName}>{professor.name}</Text>
                  <Text style={styles.professorDescription}>{professor.description}</Text>
                </View>
              ))}
              {visibleProfessors < filteredProfessors.length && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreProfessors}>
                  <Icon name="chevron-down" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.footerButtonText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Calendar')}>
          <Icon name="calendar" size={24} color="#000" />
          <Text style={styles.footerButtonText}>Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={24} color="#000" />
          <Text style={styles.footerButtonText}>Perfil</Text>
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
  backButton: {
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
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  horizontalScrollView: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  professorCard: {
    width: 150,
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  professorImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  professorDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadMoreButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    marginVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default CoursesScreen;
