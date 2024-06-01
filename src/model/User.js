class User {
    constructor(uid, name, email, role) {
      this.uid = uid;
      this.name = name;
      this.email = email;
      this.role = role;
    }
  
    toDatabase() {
      return {
        uid: this.uid,
        name: this.name,
        email: this.email,
        role: this.role,
      };
    }
  
    static fromDatabase(data) {
      return new User(data.uid, data.name, data.email, data.role);
    }
  }
  
  export default User;
  