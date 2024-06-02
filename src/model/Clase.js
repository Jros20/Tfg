import { db, storage } from '../utils/firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

class Clase {
  constructor(id, courseId, duration, videoUrl, imageUrl, attachedFiles) {
    this.id = id;
    this.courseId = courseId;
    this.duration = duration;
    this.videoUrl = videoUrl;
    this.imageUrl = imageUrl;
    this.attachedFiles = attachedFiles;
  }

  static async create(courseId, duration, videoUri, imageUri, attachedFiles) {
    try {
      if (!courseId) {
        throw new Error('courseId is undefined');
      }
      console.log('courseId:', courseId);

      const videoRef = ref(storage, `classVideos/${courseId}/${Date.now()}`);
      const videoBlob = await (await fetch(videoUri)).blob();
      const videoUploadTask = uploadBytesResumable(videoRef, videoBlob);
      await videoUploadTask;
      const videoUrl = await getDownloadURL(videoRef);
      console.log('Video uploaded:', videoUrl);

      const imageRef = ref(storage, `classImages/${courseId}/${Date.now()}`);
      const imageBlob = await (await fetch(imageUri)).blob();
      const imageUploadTask = uploadBytesResumable(imageRef, imageBlob);
      await imageUploadTask;
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image uploaded:', imageUrl);

      const uploadedFiles = [];
      for (let file of attachedFiles) {
        const fileRef = ref(storage, `classFiles/${courseId}/${Date.now()}_${file.name}`);
        const fileBlob = await (await fetch(file.uri)).blob();
        const fileUploadTask = uploadBytesResumable(fileRef, fileBlob);
        await fileUploadTask;
        const fileUrl = await getDownloadURL(fileRef);
        uploadedFiles.push({ name: file.name, url: fileUrl });
      }

      const classRef = doc(collection(db, 'Clases'));
      const classId = classRef.id;

      await setDoc(classRef, {
        id: classId,
        courseId,
        duration,
        videoUrl,
        imageUrl,
        attachedFiles: uploadedFiles,
      });

      return new Clase(classId, courseId, duration, videoUrl, imageUrl, uploadedFiles);
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  static async getClassesByCourse(courseId) {
    try {
      console.log('Fetching classes for course:', courseId);
      const q = query(collection(db, 'Clases'), where('courseId', '==', courseId));
      const querySnapshot = await getDocs(q);
      const classes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classes.push(new Clase(
          data.id,
          data.courseId,
          data.duration,
          data.videoUrl,
          data.imageUrl,
          data.attachedFiles
        ));
      });
      return classes;
    } catch (error) {
      console.error('Error getting classes by course:', error);
      throw error;
    }
  }

  static async getClassById(classId) {
    try {
      console.log('Fetching class by ID:', classId);
      const classDoc = await getDoc(doc(db, 'Clases', classId));
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }
      const data = classDoc.data();
      return new Clase(
        data.id,
        data.courseId,
        data.duration,
        data.videoUrl,
        data.imageUrl,
        data.attachedFiles
      );
    } catch (error) {
      console.error('Error getting class by ID:', error);
      throw error;
    }
  }
}

export default Clase;
