import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import moment from 'moment';
import { generateWeeklySummaryData, initializeWeeklySummary } from './helper';

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
        this.auth = app.auth();
        this.googleAuthProvider = new app.auth.GoogleAuthProvider();
    }

    firestoreDB = () => this.db;
    firestoreCollection = (col) => this.db.collection(col);
    enrollmentForms = () => this.db.collection(`enrollmentForm`);
    users = () => this.db.collection('users');
    weeklyIntake = () => this.db.collection('weeklyIntake');
    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleAuthProvider);
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    getUserDoc = (docName) => this.users().doc(docName);
    userBioCollection = (userDocName) => this.getUserDoc(userDocName).collection("biodata");
    weeklyIntakeSummary = () => this.weeklyIntake().doc("summary");
    weeklyIntakeSummaryData = () => this.weeklyIntake().doc("summary").collection("data");
    
    createBioMechanicsData = (data) => {
        return new Promise((resolve, reject) => {
            var WeeklySummaryDoc = this.weeklyIntakeSummary();

            data.createdAt = moment(data.createdAt || new Date()).format('MM-DD-YYYY');
            let dateCreated = data.createdAt;

            let userProfile = {
                firstName: (data.user && data.user.firstName) || '',
                lastName: (data.user && data.user.lastName) || '',
                email: (data.user && data.user.email) || ''
            };
            let userName = userProfile && (userProfile.firstName || userProfile.lastName);
            let email = userProfile && userProfile.email;
            let docName = `${userName}-${dateCreated}`;

            //check if email was passed. We need the 
            if(!email) return reject(`Please provide user's e-mail address`);

            // Create a reference for a new BMI, for use inside the transaction
            let weeklyIntakeSummaryDocRef = this.weeklyIntakeSummaryData().doc(docName);

            //check if similar summary data document exists
            weeklyIntakeSummaryDocRef.get().then(async(doc) => {
                if(doc.exists) return reject('Similar document already exists');

                //check if user exists
                let getUser = await this.getUserDoc(email).get().then(userDoc => {
                    if(userDoc.exists) return { exists: true, data: userDoc.data() };
                    return { exists: false };
                });

                console.log("User exists", getUser.exists, " email === ", email);
                if(getUser.exists){
                    //update the existing summary data
                    let userSummaryData = generateWeeklySummaryData(data, getUser.data.summary);
                    let updateUser = this.getUserDoc(email).update({ summary: userSummaryData });
                } else {
                    //create new user, then set the summary data
                    let freshWeeklySummary = initializeWeeklySummary();
                    let userSummaryData = generateWeeklySummaryData(data, freshWeeklySummary);
                    let createuser = this.getUserDoc(email).set({ ...userProfile, summary: userSummaryData });
                }
                //add biodata info to this user's collection
                let addBioData = this.userBioCollection(email).doc(docName).set(data);


                // In a transaction, add the new bmi and update the aggregate totals
                return this.firestoreDB().runTransaction(transaction => {
                    return transaction.get(WeeklySummaryDoc).then(res => {
                        if (!res.exists) {
                            return reject("Document does not exist!");
                        }

                        //generate weekly summary data
                        let weeklySummaryData = generateWeeklySummaryData(data, res.data());
                        transaction.update(WeeklySummaryDoc, weeklySummaryData);

                        //Commit to Firestore, add new data to the weeklyIntakeSummary data
                        transaction.set(weeklyIntakeSummaryDocRef, { ...data });

                        return resolve();
                    })
                });
            }).catch(function(error) {
                console.log("Error getting document:", error);
                return reject('Error getting document');
            });
        })
    }
};

export default Firebase;
