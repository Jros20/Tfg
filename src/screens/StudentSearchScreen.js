import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from '../components/Footer';
import StudentCard from '../components/StudentCard';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';

const StudentSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [categories, setCategories] = useState(['Todas']); // Default category 'Todas'
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategoriesAndStudents = async () => {
      try {
        const categoriesQuerySnapshot = await getDocs(collection(db, 'Categorias'));
        const categoriesData = categoriesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const categoryMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.NombreCategoria;
          return map;
        }, {});

        setCategories(['Todas', ...categoriesData.map(cat => cat.NombreCategoria)]);

        const usersQuerySnapshot = await getDocs(collection(db, 'users'));
        const studentsQuerySnapshot = await getDocs(collection(db, 'Estudiantes'));

        console.log("Users Query Snapshot:", usersQuerySnapshot.docs.length);
        console.log("Students Query Snapshot:", studentsQuerySnapshot.docs.length);

        const studentsData = [];

        studentsQuerySnapshot.forEach((studentDoc) => {
          const studentData = studentDoc.data();
          console.log("Student Document Data:", studentData);

          const userDoc = usersQuerySnapshot.docs.find(userDoc => userDoc.id === studentDoc.id);
          if (userDoc) {
            const userData = userDoc.data();
            console.log("User Document Data:", userData);

            if (userData.role === 'ALUMNO') { // Ajuste para buscar rol "ALUMNO"
              const student = {
                id: userData.uid,
                name: userData.name,
                email: userData.email,
                interests: studentData.intereses.map(interestId => categoryMap[interestId]).filter(Boolean), // Convertir IDs de intereses a nombres de categorías
                profileImage: userData.profileImage || userData.fotoPerfil // Usar profileImage o fotoPerfil
              };
              studentsData.push(student);
            }
          } else {
            console.log(`No matching user found for student ID: ${studentDoc.id}`);
          }
        });

        setStudents(studentsData);
        setFilteredStudents(studentsData);
        console.log("Fetched students:", studentsData);  // Log the fetched students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchCategoriesAndStudents();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    filterStudents(text, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterStudents(searchText, category);
  };

  const filterStudents = (text, category) => {
    const filtered = students.filter(student =>
      (category === 'Todas' || student.interests.includes(category)) &&
      (student.name.toLowerCase().includes(text.toLowerCase()) ||
       student.id.includes(text))
    );
    setFilteredStudents(filtered);
    console.log("Filtered students:", filtered);  // Log the filtered students
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
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
