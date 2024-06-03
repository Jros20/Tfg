// ChatScreenDetail.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const ChatScreenDetail = () => {
  const route = useRoute();
  const { contactId } = route.params;
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contactName, setContactName] = useState('');
  const [contactImage, setContactImage] = useState('');
  const userIconRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactDoc = await getDoc(doc(db, 'users', contactId));
        if (contactDoc.exists()) {
          const contactData = contactDoc.data();
          setContactName(contactData.name);
          setContactImage(contactData.profileImage || contactData.fotoPerfil);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const conversacionId = getConversacionId(user.uid, contactId);
          const mensajesQuery = query(
            collection(db, 'mensajes', conversacionId, 'mensajes'),
            orderBy('timestamp', 'asc')
          );
          onSnapshot(mensajesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            setMessages(fetchedMessages);
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchContactInfo();
    fetchMessages();
  }, [contactId]);

  const getConversacionId = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
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

  const sendMessage = async () => {
    if (message.trim()) {
      const user = auth.currentUser;
      if (user) {
        const conversacionId = getConversacionId(user.uid, contactId);
        try {
          await addDoc(collection(db, 'mensajes', conversacionId, 'mensajes'), {
            UID: user.uid,
            contenido: message,
            timestamp: Timestamp.now(),
          });
        
          setMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  };
  

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.UID === auth.currentUser.uid ? styles.myMessageBubble : {}]}>
      <Text style={styles.messageText}>{item.contenido}</Text>
      <Text style={styles.messageTime}>{item.timestamp.toDate().toLocaleTimeString().slice(0, 5)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          {contactImage && (
            <Image source={{ uri: contactImage }} style={styles.contactImage} />
          )}
          <Text style={styles.title}>{contactName}</Text>
        </View>
        <View style={styles.headerRight}>
          
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
    marginBottom:10,
  },
  backButton: {
    padding: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
