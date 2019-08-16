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
    }

    firestoreDB = () => this.db;
    firestoreCollection = (col) => this.db.collection(col);
    enrollmentForms = () => this.db.collection(`enrollmentForm`);
    weeklyIntake = () => this.db.collection('weeklyIntake');
    weeklyIntakeSummary = () => this.weeklyIntake().doc("summary");
    weeklyIntakeSummaryData = () => this.weeklyIntakeSummary().collection("data");
};

export default Firebase;