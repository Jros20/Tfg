class User {
  constructor(uid, name, email, role, fotoPerfil, profileImage) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.role = role;
    this.fotoPerfil = fotoPerfil;
    this.profileImage = profileImage;
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
    return new User(snapshot.id, data.name, data.email, data.role, data.fotoPerfil, data.profileImage);
  }
}

export default User;
