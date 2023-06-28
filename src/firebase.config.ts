import config from "./config/config";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
};

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth(app);

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, app, googleAuthProvider, auth };
