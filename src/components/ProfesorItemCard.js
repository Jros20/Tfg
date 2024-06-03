import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ProfesorItemCard = ({ professor }) => {
  const navigation = useNavigation();

  const createAviso = async () => {
    try {
      const user = auth.currentUser;
      console.log('User:', user); // Log user object
      console.log('Professor:', professor); // Log professor object

      if (!user) {
        console.log('Error: No user is logged in.');
        return;
      }

      if (!professor.uid) {
        console.log('Error: Professor UID is missing.');
        return;
      }

      await addDoc(collection(db, 'avisos'), {
        senderId: user.uid,
        receiverId: professor.uid,
        timestamp: Timestamp.now(),
      });
      console.log('Aviso created');

      // Navigate to ChatScreenDetail after creating the aviso
      navigation.navigate('ChatScreenDetail', { contactId: professor.uid, contactName: professor.name, contactImage: professor.profileImage });
    } catch (error) {
      console.error('Error creating aviso:', error);
    }
  };

  return (
    <View style={[styles.professorCard, styles.verticalProfessorCard]}>
      <Image source={{ uri: professor.profileImage }} style={styles.professorImage} />
      <Text style={styles.professorName}>{professor.name}</Text>
      <Text style={styles.professorDescription}>{professor.description}</Text>
      <TouchableOpacity style={styles.chatIcon} onPress={createAviso}>
        <Icon name="comments" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  professorCard: {
    width: 150,
    height: 250,
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
  chatIcon: {
    padding: 10,
  },
});

export default ProfesorItemCard;
