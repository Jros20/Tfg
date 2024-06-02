import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const navigateToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  const navigateToCalendarScreen = () => {
    navigation.navigate('CalendarScreen');
  };

  const navigateToSearchScreen = () => {
    if (userRole === 'PROFESOR') {
      navigation.navigate('StudentSearchScreen');
    } else {
      navigation.navigate('SearchScreen');
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={navigateToChatScreen}>
        <Icon name="comments" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={navigateToCalendarScreen}>
        <Icon name="book" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={navigateToSearchScreen}>
        <Icon name="search" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Footer;
