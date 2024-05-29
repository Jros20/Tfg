import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const navigation = useNavigation();
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(10);
  const [visibleProfessors, setVisibleProfessors] = useState(4);
  const [filter, setFilter] = useState('all');
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
  const openMenuModal = () => {
    setMenuModalVisible(true);
  };

  const closeMenuModal = () => {
    setMenuModalVisible(false);
  };
  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } else if (item.name === 'METODO DE PAGO') {
      navigation.navigate('MetodoPago');
    }
  };
  const closeModal = () => {
    setNoteModalVisible(false);
  };
  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 2, name: 'METODO DE PAGO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

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

  const isSingleView = (showCourses && !showProfessors) || (!showCourses && showProfessors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}  onPress={openMenuModal}>
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
      <MenuModal
        visible={menuModalVisible}
        onClose={closeMenuModal}
        menuItems={menuItems}
        handleMenuItemPress={handleMenuItemPress}
      />
      {isSingleView ? (
        <ScrollView contentContainerStyle={styles.verticalScrollView}>
          {showCourses && filteredCourses.slice(0, visibleCourses).map((course) => (
            <View key={course.id} style={[styles.card, styles.verticalCard]}>
              <Text style={styles.cardText}>{course.name}</Text>
            </View>
          ))}
          {showProfessors && filteredProfessors.slice(0, visibleProfessors).map((professor) => (
            <View key={professor.id} style={[styles.professorCard, styles.verticalProfessorCard]}>
              <Image source={{ uri: professor.image }} style={styles.professorImage} />
              <Text style={styles.professorName}>{professor.name}</Text>
              <Text style={styles.professorDescription}>{professor.description}</Text>
            </View>
          ))}
          {showCourses && visibleCourses < filteredCourses.length && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreCourses}>
              <Icon name="chevron-down" size={24} color="#000" />
            </TouchableOpacity>
          )}
          {showProfessors && visibleProfessors < filteredProfessors.length && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreProfessors}>
              <Icon name="chevron-down" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
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
                  <TouchableOpacity style={styles.loadMoreButtonHorizontal} onPress={loadMoreCourses}>
                    <Icon name="chevron-right" size={24} color="#000" />
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
                  <TouchableOpacity style={styles.loadMoreButtonHorizontal} onPress={loadMoreProfessors}>
                    <Icon name="chevron-right" size={24} color="#000" />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
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
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  searchButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalButton: {
    marginTop: 20,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  verticalScrollView: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalScrollView: {
    flexDirection: 'row',
  },
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
    alignSelf: 'center',
    width: width * 0.9,  // Aumentar el ancho de la tarjeta en vista vertical
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
  },
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
    alignSelf: 'center',
    width: width * 0.9,  // Aumentar el ancho de la tarjeta en vista vertical
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
  loadMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  loadMoreButtonHorizontal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
  },
});

export default CoursesScreen;
