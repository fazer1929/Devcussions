import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
    apiKey: "AIzaSyBrB5o_pKSbzfifcH2FJbsbHz-WOqXZ2d0",
    authDomain: "social-app-9b4b4.firebaseapp.com",
    databaseURL: "https://social-app-9b4b4.firebaseio.com",
    projectId: "social-app-9b4b4",
    storageBucket: "social-app-9b4b4.appspot.com",
    messagingSenderId: "1058320630933",
    appId: "1:1058320630933:web:e82876f8bf52bafcb4c79c",
    measurementId: "G-D3EGSNY8H8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  export default firebase;