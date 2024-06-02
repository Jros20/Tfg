import { db, storage, auth } from '../utils/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

class Clase {
  constructor(id, courseName, duration, videoUrl, imageUrl, attachedFiles) {
    this.id = id;
    this.courseName = courseName;
    this.duration = duration;
    this.videoUrl = videoUrl;
    this.imageUrl = imageUrl;
    this.attachedFiles = attachedFiles;
  }

  static async create(courseName, duration, videoUri, imageUri, attachedFiles) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const uploadFile = async (uri, folder) => {
        const storageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}`);
        const response = await fetch(uri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            () => resolve()
          );
        });

        return getDownloadURL(uploadTask.snapshot.ref);
      };

      const videoUrl = videoUri ? await uploadFile(videoUri, 'classVideos') : null;
      const imageUrl = imageUri ? await uploadFile(imageUri, 'classImages') : null;
      const uploadedFiles = await Promise.all(
        attachedFiles.map(file => uploadFile(file, 'attachedFiles'))
      );

      const classRef = await addDoc(collection(db, 'Clases'), {
        courseName,
        duration,
        videoUrl,
        imageUrl,
        attachedFiles: uploadedFiles,
      });

      return new Clase(classRef.id, courseName, duration, videoUrl, imageUrl, uploadedFiles);
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  static async getClassesByCourse(courseName) {
    try {
      const q = query(collection(db, 'Clases'), where('courseName', '==', courseName));
      const querySnapshot = await getDocs(q);
      const classes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const clase = new Clase(
          doc.id,
          data.courseName,
          data.duration,
          data.videoUrl,
          data.imageUrl,
          data.attachedFiles
        );
        classes.push(clase);
      });
      return classes;
    } catch (error) {
      console.error('Error getting classes by course:', error);
      throw error;
    }
  }
}

export default Clase;
