import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyCzOWAwlWP4zO6sgYB-51jhRHmf6gl2KA4",
  authDomain: "react-slack-clone-e107a.firebaseapp.com",
  databaseURL: "https://react-slack-clone-e107a-default-rtdb.firebaseio.com",
  projectId: "react-slack-clone-e107a",
  storageBucket: "react-slack-clone-e107a.appspot.com",
  messagingSenderId: "435845847924"
};


firebase.initializeApp(config);



export default firebase;
