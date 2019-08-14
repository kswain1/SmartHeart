import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

        this.fieldValue = app.firestore.FieldValue;
        this.emailAuthProvider = app.auth.EmailAuthProvider;

        this.db = app.firestore();

        this.auth = app.auth()
        this.googleAuthProvider = new app.auth.GoogleAuthProvider();
         // Auth appId
        // createUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
        // signInWithEmailAndPassword = (email, password) = > this.auth.signInWithEmailAndPassword(email, password);
        // signOut = () => this.auth.signOut();
        // passwordReset = email => this.auth.sendPasswordResetEmail(email);
        // passwordUpdate = password => this.auth.currentUser.updatePassword(password);
    }

    enrollmentForms = () => this.db.collection(`enrollmentForm`);
    weeklyIntake = () => this.db.collection('weeklyIntake');
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleAuthProvider);
};

export default Firebase;
