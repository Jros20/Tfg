import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ChatScreenDetail = () => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'HOLA QUE TAL ESTAS?', time: '17:28', isMine: false },
    { id: '2', text: 'MUY BIEN, GRACIAS', time: '18:23', isMine: true },
  ]);
  const userIconRef = useRef(null);
  const navigation = useNavigation();

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

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: message, time: new Date().toLocaleTimeString().slice(0, 5), isMine: true },
      ]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.isMine ? styles.myMessageBubble : {}]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Chat</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="paper-plane" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        transparent={true}
        visible={profileModalVisible}
        animationType="fade"
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.profileModalOverlay}>
          <View
            style={[
              styles.profileModalTriangle,
              { top: userIconPosition.y - 785, left: userIconPosition.x + 10 },
            ]}
          />
          <View
            style={[
              styles.profileModalContent,
              { top: userIconPosition.y - 775, left: userIconPosition.x - 160 },
            ]}
          >
            <TouchableOpacity style={styles.profileModalButton} onPress={() => { /* Implement logout functionality here */ }}>
              <Text style={styles.profileModalButtonText}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileModalButton} onPress={navigateToUserDetail}>
              <Text style={styles.profileModalButtonText}>VER DETALLES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  searchButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  myMessageBubble: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  profileModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    position: 'absolute',
  },
  profileModalContent: {
    width: 200,
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
  },
  profileModalButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  profileModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default ChatScreenDetail;
