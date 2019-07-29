import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyBgHO1hRIx_BUBbd4LFmXz9_-jEY5DvJ6E",
    authDomain: "fir-trialtwo.firebaseapp.com",
    databaseURL: "https://fir-trialtwo.firebaseio.com",
    projectId: "fir-trialtwo",
    storageBucket: "fir-trialtwo.appspot.com",
    messagingSenderId: "360216789009",
    appId: "1:360216789009:web:b1e49a4b6e38d4c7"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timeInSnapshots});


export default firebase;