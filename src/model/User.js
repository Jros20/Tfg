class User {
    constructor(uid, name, email, role, fotoPerfil) {
      this.uid = uid;
      this.name = name;
      this.email = email;
      this.role = role;
      this.fotoPerfil = fotoPerfil;
    }
  
    toFirestore() {
      return {
        uid: this.uid,
        name: this.name,
        email: this.email,
        role: this.role,
        fotoPerfil: this.fotoPerfil,
      };
    }
  
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new User(snapshot.id, data.name, data.email, data.role, data.fotoPerfil);
    }
  }
  
  export default User;
  