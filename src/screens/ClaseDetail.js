import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import ProfileModal from '../components/ProfileModal';
import moment from 'moment';

const ClaseDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { classId } = route.params;
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userIconPosition, setUserIconPosition] = useState({ x: 0, y: 0 });
  const [comment, setComment] = useState('');
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const docRef = doc(db, 'Clases', classId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClassData(docSnap.data());
          console.log("Fetched class data:", docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(classId);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [classId]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
          console.log("Fetched profile image:", userDoc.data().profileImage);
        }
      }
    };

    fetchProfileImage();
  }, []);

  const openCommentModal = () => {
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
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

  const handleCommentSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'Comentarios'), {
          UID: user.uid,
          classId: classId,
          content: comment,
          timestamp: Timestamp.now()
        });
        const updatedComments = await getComments(classId);
        setComments(updatedComments);
        setComment('');
        closeCommentModal();
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const getComments = async (classId) => {
    console.log("Fetching comments for classId:", classId); // Log
    const q = query(collection(db, 'Comentarios'), where('classId', '==', classId));
    const querySnapshot = await getDocs(q);
    const commentsData = [];
    for (const docSnap of querySnapshot.docs) {
      const commentData = docSnap.data();
      console.log("Fetched comment data:", commentData); // Log
      try {
        const userDocRef = doc(db, 'users', commentData.UID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData); // Log
          commentsData.push({ 
            id: docSnap.id, 
            ...commentData, 
            user: userData 
          });
        } else {
          console.log(`No such user with UID: ${commentData.UID}`);
          commentsData.push({
            id: docSnap.id,
            ...commentData,
            user: { name: 'Usuario desconocido', profileImage: null }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error); // Log error
        commentsData.push({
          id: docSnap.id,
          ...commentData,
          user: { name: 'Error al obtener usuario', profileImage: null }
        });
      }
    }
    console.log("Final comments data:", commentsData); // Log
    return commentsData;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{classData?.className || 'Clase'}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity ref={userIconRef} style={styles.profileButton} onPress={openProfileModal}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Icon name="user" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {classData?.videoUrl ? (
          <WebView
            style={styles.video}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: classData.videoUrl }}
          />
        ) : (
          <Text style={styles.noVideoText}>No hay video disponible</Text>
        )}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>COMENTARIOS</Text>
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                {comment.user?.profileImage ? (
                  <Image source={{ uri: comment.user.profileImage }} style={styles.commentUserImage} onError={(e) => console.error('Error loading image:', e.nativeEvent.error)} />
                ) : (
                  <Icon name="user" size={24} color="#000" />
                )}
                <Text style={styles.commentUserName}>{comment.user?.name || 'Usuario desconocido'}</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
              <Text style={styles.commentTimestamp}>{moment(comment.timestamp.toDate()).format('LLL')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openCommentModal}>
        <Icon name="comment" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={commentModalVisible}
        animationType="slide"
        onRequestClose={closeCommentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeCommentModal}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.label}>ESCRIBE TU COMENTARIO</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your comment"
              placeholderTextColor="#666"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
              <Text style={styles.buttonTextSubmit}>PUBLICAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ProfileModal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        userIconPosition={userIconPosition}
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
  profileButton: {
    padding: 10,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  video: {
    width: '100%',
    height: 200,
  },
  noVideoText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#666',
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentCard: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonTextSubmit: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClaseDetail;