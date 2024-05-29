import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const MenuModal = ({ visible, onClose, menuItems, handleMenuItemPress }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateX }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItemContainer} onPress={() => handleMenuItemPress(item)}>
              <Text style={styles.menuItem}>{item.name}</Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    width: '70%',
    height: '100%',
    backgroundColor: '#cccccc',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menuItemContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 10,
  },
});

export default MenuModal;
