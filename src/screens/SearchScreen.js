import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import User from '../model/User';
import Curso from '../model/Curso';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import CursoItemCard from '../components/CursoItemCard';
import ProfesorItemCard from '../components/ProfesorItemCard';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const navigation = useNavigation();
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(10);
  const [visibleProfessors, setVisibleProfessors] = useState(4);
  const [filter, setFilter] = useState('all');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCourses, setShowCourses] = useState(true);
  const [showProfessors, setShowProfessors] = useState(true);

  useEffect(() => {
    const fetchCoursesAndProfessors = async () => {
      try {
        const coursesQuerySnapshot = await getDocs(collection(db, 'Cursos'));
        const coursesData = coursesQuerySnapshot.docs.map(doc => {
          console.log("Course document data:", doc.data());
          return Curso.fromFirestore(doc);
        });

        const professorsQuerySnapshot = await getDocs(collection(db, 'users'));
        const professorsData = professorsQuerySnapshot.docs
          .map(doc => {
            console.log("User document data:", doc.data());
            return User.fromFirestore(doc);
          })
          .filter(user => user.role === 'PROFESOR');  // Filtrar solo usuarios con rol 'PROFESOR'

        setCourses(coursesData);
        setProfessors(professorsData);
        console.log("Fetched courses:", coursesData);
        console.log("Fetched professors:", professorsData);

        // Fetch tutor details
        const tutorsQuerySnapshot = await getDocs(collection(db, 'Tutores'));
        const tutorsData = tutorsQuerySnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        }));
        setTutors(tutorsData);
        console.log("Fetched tutors:", tutorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesQuerySnapshot = await getDocs(collection(db, 'Categorias'));
        const categoriesData = categoriesQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().NombreCategoria
        }));
        setCategories(categoriesData);
        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCoursesAndProfessors();
    fetchCategories();
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
    closeMenuModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      navigation.navigate('UserInterface');
    } 
     else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  const filterItems = (items) => {
    let filtered = items;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory);
    }
    return filtered;
  };

  const filterProfessors = (professors, tutors) => {
    if (selectedCategory === 'all') {
      return professors;
    }
    const filteredTutors = tutors.filter(tutor => tutor.especializaciones && tutor.especializaciones.includes(selectedCategory));
    const filteredTutorIds = filteredTutors.map(tutor => tutor.uid);
    return professors.filter(professor => filteredTutorIds.includes(professor.uid));
  };

  const filteredCourses = filterItems(courses);
  const filteredProfessors = filterProfessors(professors, tutors);

  const isSingleView = (showCourses && !showProfessors) || (!showCourses && showProfessors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={openMenuModal}>
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
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
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
            <CursoItemCard key={course.courseId} course={course} />
          ))}
          {showProfessors && filteredProfessors.slice(0, visibleProfessors).map((professor) => (
            <ProfesorItemCard key={professor.uid} professor={professor} />
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
                  <CursoItemCard key={course.courseId} course={course} />
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
                  <ProfesorItemCard key={professor.uid} professor={professor} />
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
    alignItems: 'center',
  },
  verticalScrollView: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start',
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
});

export default CoursesScreen;
