class User {
    constructor(uid, name, email, role) {
      this.uid = uid;
      this.name = name;
      this.email = email;
      this.role = role;
    }
  
    toFirestore() {
      return {
        uid: this.uid,
        name: this.name,
        email: this.email,
        role: this.role,
      };
    }
  
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new User(snapshot.id, data.name, data.email, data.role);
    }
  }
  
  export default User;
  