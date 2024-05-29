import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

const ClaseDetail = () => {
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  const openCommentModal = () => {
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  const handleCommentSubmit = () => {
    // Lógica para enviar el comentario
    closeCommentModal();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>MATEMÁTICAS 1</Text>
        </View>
        <WebView
          style={styles.video}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: 'https://www.youtube.com/watch?v=gnTENXZc1jU&list=RDgnTENXZc1jU&start_radio=1&ab_channel=izalVEVO&themeRefresh=1' }} // URL del video de YouTube
        />
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>COMENTARIOS</Text>
          <View style={styles.commentCard}>
            <Text style={styles.commentText}>ME HA ENCANTADO EL VIDEO</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openCommentModal}>
        <Icon name="search" size={24} color="#fff" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  video: {
    width: '100%',
    height: 200,
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
  commentText: {
    fontSize: 16,
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
});

export default ClaseDetail;
