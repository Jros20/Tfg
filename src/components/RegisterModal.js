import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const RegisterModal = ({ modalVisible, setModalVisible }) => {
  const opacity = useSharedValue(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (modalVisible) {
      opacity.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
    }
  }, [modalVisible]);

  const closeModal = () => {
    opacity.value = withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }, () => {
      setModalVisible(false);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, animatedStyle]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModal}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.label}>NOMBRE</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>CONTRASEÑA</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your password..."
            placeholderTextColor="#666"
            secureTextEntry
          />

          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your email"
            placeholderTextColor="#666"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.studentButton} onPress={() => navigation.navigate('UserInterface')}>
              <Text style={styles.buttonTextStudent}>ALUMNO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.teacherButton} onPress={() => navigation.navigate('TeacherInterface')}>
              <Text style={styles.buttonTextTeacher}>PROFESOR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginStart: '5%',
    height: '90%',
    marginBottom: '20%',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#cccccc',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  buttonTextStudent: {
    color: '#000',
  },
  buttonTextTeacher: {
    color: '#fff',
  },
  studentButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  teacherButton: {
    flex: 1,
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default RegisterModal;
