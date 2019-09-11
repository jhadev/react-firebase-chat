import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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

  doSignOutUser = (authUser, status = false) => {
    this.setOnlineStatus(authUser, status);
    return this.auth.signOut();
  };

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  //allows sending to each room
  send = (room, message) => this.db.ref(room).push(message);

  //get all firebase table numbers but not users table
  allRooms = () =>
    this.db
      .ref()
      .once('value')
      .then(snapshot => {
        return Object.keys(snapshot.val()).filter(
          room => room !== 'users' && room !== 'dms'
        );
      });

  //allows rooms to be set using state in home
  chat = room => this.db.ref(room);
  //match the location where users are stored based on their uid
  user = uid => this.db.ref(`users/${uid}`);

  setOnlineStatus = (authUser, status) => {
    this.db.ref(`users/${authUser.uid}`).update({ online: status });
  };

  getOnlineStatus = authUser => {
    this.db
      .ref(`users/${authUser.uid}`)
      .on('value')
      .then(snapshot => {
        if (snapshot.val()) {
          return snapshot.val().online;
        }
      })
      .catch(err => console.log(err));
  };
  // setOnlineStatus = uid => this.db.ref(`users/${uid}`).

  dms = () => this.db.ref('dms');

  sendDm = message => this.db.ref('dms').push(message);

  //ref to the users db
  users = () => this.db.ref('users');
}

export default Firebase;
