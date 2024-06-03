import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ContactCard = ({ contact }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChatScreenDetail', { contactId: contact.id })}>
      {contact.profileImage ? (
        <Image source={{ uri: contact.profileImage }} style={styles.icon} />
      ) : (
        <Icon name="user" size={40} color="#000" style={styles.icon} />
      )}
      <Text style={styles.text}>{contact.name}</Text>
      <Text style={styles.hiddenText}>{contact.id}</Text> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hiddenText: {
    display: 'none', // Hide the ID
  },
});

export default ContactCard;
