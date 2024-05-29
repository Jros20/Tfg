import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, TextInput, StyleSheet, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';

const { width } = Dimensions.get('window');

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const navigation = useNavigation();
  const userIconRef = useRef(null);
  const translateX = useRef(new Animated.Value(-width)).current;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes', error);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes', error);
      }
    };
    saveNotes();
  }, [notes]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (notes[day.dateString]) {
      setNote(notes[day.dateString]);
    } else {
      setNote('');
    }
    setNoteModalVisible(true);
  };

  const handleAddNote = () => {
    setNotes({ ...notes, [selectedDate]: note });
    setNoteModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const newMarkedDates = {
      [today]: { selected: true, selectedColor: 'green' },
    };
    for (const date in notes) {
      newMarkedDates[date] = { marked: true, dotColor: 'red' };
    }
    setMarkedDates(newMarkedDates);
  }, [notes]);

  const openMenuModal = () => {
    setMenuModalVisible(true);
  };

  const closeMenuModal = () => {
    setMenuModalVisible(false);
  };

  const openProfileModal = () => {
    userIconRef.current.measure((fx, fy, width, height, px, py) => {
      setUserIconPosition({ x: px, y: py + height });
      setProfileModalVisible(true);
    });
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
  };

  const openNoteModal = () => {
    setNoteModalVisible(true);
  };

  const closeNoteModal = () => {
    setNoteModalVisible(false);
  };
  const closeModal = () => {
    setNoteModalVisible(false);
  };
  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
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
  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 2, name: 'METODO DE PAGO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openMenuModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendario</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchScreen')}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          todayTextColor: 'green',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: 'orange',
          monthTextColor: 'blue',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        style={styles.calendar}
      />

      <TouchableOpacity style={styles.addButton} onPress={openNoteModal}>
        <Text style={styles.addButtonText}>AGREGAR FECHA</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={noteModalVisible}
        animationType="slide"
        onRequestClose={closeNoteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Agregar nota"
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.buttonText}>Seleccionar Fecha</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleAddNote}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closeNoteModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />

      <MenuModal
        visible={menuModalVisible}
        onClose={closeMenuModal}
        menuItems={menuItems}
        handleMenuItemPress={handleMenuItemPress}
      />

      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
        navigateToUserDetail={navigateToUserDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
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
  calendar: {
    margin: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  datePicker: {
    width: '100%',
  },
});

export default CalendarScreen;
