class ClaseComentario {
    constructor(id, uid, classId, content, timestamp, user) {
      this.id = id;
      this.uid = uid;
      this.classId = classId;
      this.content = content;
      this.timestamp = timestamp;
      this.user = user;
    }
  
    static fromFirestore(snapshot, user) {
      const data = snapshot.data();
      return new ClaseComentario(snapshot.id, data.UID, data.classId, data.content, data.timestamp, user);
    }
  }
  
  export default ClaseComentario;
  