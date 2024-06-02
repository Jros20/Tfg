import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const StudentCard = ({ student }) => {
  const navigation = useNavigation();

  const navigateToChat = () => {
    navigation.navigate('ChatScreenDetail', { studentId: student.id });
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.email}>{student.email}</Text>
        <Text style={styles.interests}>Intereses: {student.interests.join(', ')}</Text>
      </View>
      <TouchableOpacity style={styles.chatIcon} onPress={navigateToChat}>
        <Icon name="comments" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  interests: {
    fontSize: 14,
    color: '#888',
  },
  chatIcon: {
    padding: 10,
  },
});

export default StudentCard;
