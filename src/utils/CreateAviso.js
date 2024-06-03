import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase'; // Asegúrate de importar db correctamente

const createAviso = async (senderId, receiverId) => {
  try {
    await addDoc(collection(db, 'avisos'), {
      senderId,
      receiverId,
      timestamp: Timestamp.now(),
    });
    console.log('Aviso creado');
  } catch (error) {
    console.error('Error creating aviso:', error);
  }
};

export default createAviso;
