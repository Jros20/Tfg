import { db, auth, storage } from '../utils/firebase';
import { doc, setDoc, getDoc, query, where, getDocs, addDoc, collection } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

class Curso {
  constructor(id, tutorId, courseName, description, duration, categoryId, imageUrl) {
    this.id = id;
    this.tutorId = tutorId;
    this.courseName = courseName;
    this.description = description;
    this.duration = duration;
    this.categoryId = categoryId;
    this.imageUrl = imageUrl;
  }

  static async create(courseName, description, duration, categoryId, imageUri) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `courseImages/${user.uid}/${Date.now()}`);
      const response = await fetch(imageUri);
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

      const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

      // Add course to Firestore
      const courseRef = await addDoc(collection(db, 'Cursos'), {
        tutorId: user.uid,
        courseName,
        description,
        duration,
        categoryId,
        imageUrl,
      });

      return new Curso(courseRef.id, user.uid, courseName, description, duration, categoryId, imageUrl);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  static async getCoursesByTutor(tutorId) {
    try {
      const q = query(collection(db, 'Cursos'), where('tutorId', '==', tutorId));
      const querySnapshot = await getDocs(q);
      const courses = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const course = new Curso(
          doc.id,
          data.tutorId,
          data.courseName,
          data.description,
          data.duration,
          data.categoryId,
          data.imageUrl
        );
        courses.push(course);
      });
      return courses;
    } catch (error) {
      console.error('Error getting courses by tutor:', error);
      throw error;
    }
  }

  static async getCourseById(courseId) {
    try {
      const courseDoc = await getDoc(doc(db, 'Cursos', courseId));
      if (!courseDoc.exists()) {
        throw new Error('Course not found');
      }
      const data = courseDoc.data();
      return new Curso(
        courseDoc.id,
        data.tutorId,
        data.courseName,
        data.description,
        data.duration,
        data.categoryId,
        data.imageUrl
      );
    } catch (error) {
      console.error('Error getting course by ID:', error);
      throw error;
    }
  }
}

export default Curso;
