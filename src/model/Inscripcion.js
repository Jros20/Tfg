import { db, auth } from '../utils/firebase';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

class Inscripcion {
  constructor(inscripcionId, estudianteId, cursoId) {
    this.inscripcionId = inscripcionId;
    this.estudianteId = estudianteId;
    this.cursoId = cursoId;
  }

  static async create(cursoId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const inscripcionRef = doc(collection(db, 'Inscripciones'));
      const inscripcionId = inscripcionRef.id;

      await setDoc(inscripcionRef, {
        inscripcionId: inscripcionId,
        estudianteId: user.uid,
        cursoId: cursoId,
      });

      return new Inscripcion(inscripcionId, user.uid, cursoId);
    } catch (error) {
      console.error('Error creating inscripcion:', error);
      throw error;
    }
  }

  static async delete(inscripcionId) {
    try {
      await deleteDoc(doc(db, 'Inscripciones', inscripcionId));
    } catch (error) {
      console.error('Error deleting inscripcion:', error);
      throw error;
    }
  }

  static async getInscripcion(cursoId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const q = query(collection(db, 'Inscripciones'), where('cursoId', '==', cursoId), where('estudianteId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      
      const inscripcion = querySnapshot.docs[0];
      return new Inscripcion(inscripcion.id, inscripcion.data().estudianteId, inscripcion.data().cursoId);
    } catch (error) {
      console.error('Error getting inscripcion:', error);
      throw error;
    }
  }
}

export default Inscripcion;
