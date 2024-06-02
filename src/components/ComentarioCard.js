import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const ComentarioCard = ({ comment }) => {
  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        {comment.user?.profileImage ? (
          <Image source={{ uri: comment.user.profileImage }} style={styles.commentUserImage} />
        ) : (
          <Icon name="user" size={24} color="#000" />
        )}
        <Text style={styles.commentUserName}>{comment.user?.name || 'Usuario desconocido'}</Text>
      </View>
      <Text style={styles.commentText}>{comment.content}</Text>
      <Text style={styles.commentTimestamp}>{moment(comment.timestamp.toDate()).format('LLL')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ComentarioCard;
