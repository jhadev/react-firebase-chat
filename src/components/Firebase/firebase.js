import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  //built in firebase methods from auth
  doCreateUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOutUser = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  //firebase api for users
  //match the location where users are stored based on their uid
  chat = message => this.db.ref(`chat`).push(message);

  user = uid => this.db.ref(`users/${uid}`);

  //ref to the users db
  users = () => this.db.ref("users");
}

export default Firebase;
