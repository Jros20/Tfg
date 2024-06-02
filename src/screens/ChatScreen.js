import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import MenuModal from '../components/MenuModal';
import ProfileModal from '../components/ProfileModal';
import ContactCard from '../components/ContactCard';
import MessageModal from '../components/MessageModal';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [userRole, setUserRole] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const translateX = useRef(new Animated.Value(-width)).current;
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileImage(userData.profileImage || userData.fotoPerfil);
            setUserRole(userData.role);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
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

  const navigateToUserDetail = () => {
    closeProfileModal();
    navigation.navigate('UserDetail');
  };

  const handleMenuItemPress = (item) => {
    closeModal();
    if (item.name === 'DETALLES USUARIO') {
      navigation.navigate('UserDetail');
    } else if (item.name === 'MIS CURSOS') {
      if (userRole === 'PROFESOR') {
        navigation.navigate('TeacherInterface');
      } else {
        navigation.navigate('UserInterface');
      }
    } else if (item.name === 'TERMINOS Y CONDICIONES') {
      navigation.navigate('TerminosyCondiciones');
    }
  };

  const handleSendMessage = (profesor, message) => {
    // Implementar la lógica para enviar el mensaje
    console.log(`Mensaje enviado a ${profesor.name}: ${message}`);
  };

  const menuItems = [
    { id: 1, name: 'DETALLES USUARIO' },
    { id: 3, name: 'MIS CURSOS' },
    { id: 4, name: 'BUSCO PROFE' },
    { id: 5, name: 'TERMINOS Y CONDICIONES' },
  ];

  const profesores = [
    { id: 1, name: 'PROFE MATES' },
    { id: 2, name: 'PROFE MATES' },
    { id: 3, name: 'PROFE MATES' },
    { id: 4, name: 'PROFE MATES' },
    { id: 5, name: 'PROFE MATES' },
    { id: 6, name: 'PROFE MATES' },
    { id: 7, name: 'PROFE MATES' },
    { id: 8, name: 'PROFE MATES' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openModal}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>CHAT</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Icon name="user" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={profesores}
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => setMessageModalVisible(true)}>
        <Icon name="comment" size={24} color="#fff" />
      </TouchableOpacity>

      <Footer />

      <MenuModal
        visible={modalVisible}
        onClose={closeModal}
        menuItems={menuItems}
        handleMenuItemPress={handleMenuItemPress}
      />
      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
        navigateToUserDetail={navigateToUserDetail}
      />
      <MessageModal
        visible={messageModalVisible}
        onClose={() => setMessageModalVisible(false)}
        onSend={handleSendMessage}
      />
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
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default ChatScreen;
