import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

class Clase {
  constructor({ id, courseId, className, duration, imageUrl, videoUrl, documentos }) {
    this.id = id;
    this.courseId = courseId;
    this.className = className;
    this.duration = duration;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.documentos = documentos;
  }

  static async fetchClases(courseId) {
    const q = query(collection(db, 'Clases'), where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);
    const fetchedClases = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedClases.push(new Clase({ id: doc.id, ...data }));
    });
    return fetchedClases;
  }

  static isValidUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
      '((([a-zA-Z0-9\\-\\.]+)\\.[a-zA-Z]{2,})|' + // dominio
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // o dirección IP (v4)
      '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' + // puerto y ruta
      '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' + // cadena de consulta
      '(\\#[-a-zA-Z0-9_]*)?$', 'i'); // fragmento
    return !!pattern.test(url);
  }

  static async pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    } else {
      console.log('No valid image selected');
      return null;
    }
  }

  static async pickVideo() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    } else {
      console.log('No valid video selected');
      return null;
    }
  }

  static async uploadFile(uri, fileType, courseId) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `${fileType}s/${courseId}/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Puedes manejar el progreso de la subida aquí si lo deseas
          },
          (error) => {
            console.error(`Error during ${fileType} upload: `, error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
  }

  async save() {
    const classRef = doc(collection(db, 'Clases'));
    const classId = classRef.id;

    await setDoc(classRef, {
      classId: classId,
      courseId: this.courseId,
      className: this.className,
      duration: this.duration,
      imageUrl: this.imageUrl,
      videoUrl: this.videoUrl,
      documentos: this.documentos,
    });

    this.id = classId;
  }
}

export default Clase;
