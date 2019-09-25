import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import moment from 'moment';

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
    weeklyIntake = () => this.db.collection('weeklyIntake');
    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleAuthProvider);
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    weeklyIntakeSummary = () => this.weeklyIntake().doc("summary");
    //weeklyIntakeSummaryData = () => this.weeklyIntakeSummary().collection("data");
    weeklyIntakeSummaryData = () => this.weeklyIntake().doc("summary").collection("data");
    createBioMechanicsData = (data) => {
      return new Promise((resolve, reject) => {
        var WeeklySummaryDoc = this.weeklyIntakeSummary();
    		var WeeklySummaryDataCollection = this.weeklyIntakeSummaryData().doc();

    		// Create a reference for a new BMI, for use inside the transaction
            var summaryDataRef = WeeklySummaryDataCollection;

            // In a transaction, add the new bmi and update the aggregate totals
            return this.firestoreDB().runTransaction(transaction => {
                return transaction.get(WeeklySummaryDoc).then(res => {
                    if (!res.exists) {
    					             reject("Document does not exist!");
                    }

    				//get BMI and CreatedAt from data
                    var BMI = Number(data.bmi);
    								var HeartRate = Number(data.heartRate);
    								var Weight = Number(data.weight);
    								var PhysicalActivity  = Number(data.physicalActivity);
    								var BloodPressure = Number(data.bloodPressure);
    								var WaistCircumference = Number(data.waistCircumference);
                    var dateCreated = data.createdAt;
    								var heartSmartRisk = data.heartSmartRisk;//lowRisk

    								//get count of heartSmartRisk
    								var heartSmartRiskData = res.data().heartSmartRisk;
    								var totalHeartSmartRiskData = heartSmartRiskData.total;
    								var newTotalHeartSmartRisk = totalHeartSmartRiskData + 1;
    								var newHeartSmartRisk = heartSmartRiskData[heartSmartRisk] + 1;

                    //get count entries
    								var entryCounts = res.data().entryCount;
                    var bmiEntryCount = entryCounts.bmi;
    								var heartRateEntryCount = entryCounts.heartRate;
    								var weightEntryCount = entryCounts.weight;
    								var physicalActivityEntryCount = entryCounts.physicalActivity;
    								var bloodPressureCount = entryCounts.bloodPressure;
    								var waistCircumferenceCount = entryCounts.waistCircumference;

    								var newBmiEntryCount = bmiEntryCount + 1;
    								var newHeartRateEntryCount = heartRateEntryCount + 1;
    								var newWeightEntryCount = weightEntryCount + 1;
    								var newPhysicalActivityEntryCount = physicalActivityEntryCount + 1;
    								var newBloodPressureCount = bloodPressureCount + 1;
    								var newWaistCircumferenceCount = waistCircumferenceCount + 1;

                    //compute total BMI
    								var total = res.data().total;
                    var newTotalBMI = total.bmi + BMI;
    								var newTotalHeartRate = total.heartRate + HeartRate;
    								var newTotalWeight = total.weight + Weight;
    								var newTotalPhysicalActivity = total.physicalActivity + PhysicalActivity;
    								var newTotalBloodPressure = total.bloodPressure + BloodPressure;
    								var newTotalWaistCircumference = total.waistCircumference + WaistCircumference;

                    // Compute new average BMI
                    var newAverageBMI = newTotalBMI / newBmiEntryCount;
    								var newAverageHeartRate = newTotalHeartRate / newHeartRateEntryCount;
    								var newAverageWeight = newTotalWeight / newWeightEntryCount;
    								var newAveragePhysicalActivity = newTotalPhysicalActivity / newPhysicalActivityEntryCount;
    								var newAverageBloodPressure = newTotalBloodPressure / newBloodPressureCount;
    								var newAverageWaistCircumference = newTotalWaistCircumference / newWaistCircumferenceCount;

                    //set yearly average
                    var yearlyAverage = res.data().yearlyAverage;
                    var week = moment(dateCreated).week();
                    var year = moment(dateCreated).year();
                    var weekAverageData = yearlyAverage && yearlyAverage[`${year}`] && yearlyAverage[`${year}`][`${week}`] || {
    										count: {
    											bmi: 0,
    											heartRate: 0,
    											weight: 0,
    											physicalActivity: 0,
    											bloodPressure: 0,
    											waistCircumference: 0,
    										},
    										average: {
    											bmi: 0,
    											heartRate: 0,
    											weight: 0,
    											physicalActivity: 0,
    											bloodPressure: 0,
    											waistCircumference: 0,
    										},
    										total: {
    											bmi: 0,
    											heartRate: 0,
    											weight: 0,
    											physicalActivity: 0,
    											bloodPressure: 0,
    											waistCircumference: 0,
    										},
    								};

    				//update weekly count, weekly total, and weekly average for this week
    								var weeklyTotal = weekAverageData.total;
    								var weeklyCount = weekAverageData.count;
    								var weeklyAverage = weekAverageData.average;

    								var newWeeklyBMICount = weeklyCount.bmi + 1;
                    var newWeeklyBMITotal = weeklyTotal.bmi + BMI;
                    var newWeeklyBMIAvg = newWeeklyBMITotal / newWeeklyBMICount;

    								var newWeeklyHeartRateCount = weeklyCount.heartRate + 1;
                    var newWeeklyHeartRateTotal = weeklyTotal.heartRate + HeartRate;
                    var newWeeklyHeartRateAvg = newWeeklyHeartRateTotal / newWeeklyHeartRateCount;

    								var newWeeklyWeightCount = weeklyCount.weight + 1;
                    var newWeeklyWeightTotal = weeklyTotal.weight + Weight;
                    var newWeeklyWeightAvg = newWeeklyWeightTotal / newWeeklyWeightCount;

    								var newWeeklyPhysicalActivityCount = weeklyCount.physicalActivity + 1;
                    var newWeeklyPhysicalActivityTotal = weeklyTotal.physicalActivity + PhysicalActivity;
                    var newWeeklyPhysicalActivityAvg = newWeeklyPhysicalActivityTotal / newWeeklyPhysicalActivityCount;

    								var newWeeklyBloodPressureCount = weeklyCount.bloodPressure + 1;
                    var newWeeklyBloodPressureTotal = weeklyTotal.bloodPressure + BloodPressure;
                    var newWeeklyBloodPressureAvg = newWeeklyBloodPressureTotal / newWeeklyBloodPressureCount;

    								var newWeeklyWaistCircumferenceCount = weeklyCount.waistCircumference + 1;
                    var newWeeklyWaistCircumferenceTotal = weeklyTotal.waistCircumference + WaistCircumference;
                    var newWeeklyWaistCircumferenceAvg = newWeeklyWaistCircumferenceTotal / newWeeklyWaistCircumferenceCount;

                    var newYearlyAverage = {
                        ...yearlyAverage,
                        [`${year}`]: {
                            ...yearlyAverage[`${year}`],
                            [`${week}`]: {
                                count: {
    															bmi: newWeeklyBMICount,
    															heartRate: newWeeklyHeartRateCount,
    															weight: newWeeklyWeightCount,
    															physicalActivity: newWeeklyPhysicalActivityCount,
    															bloodPressure: newBloodPressureCount,
    															waistCircumference: newWaistCircumferenceCount,
    														},
                                average: {
    															bmi: newWeeklyBMIAvg,
    															heartRate: newWeeklyHeartRateAvg,
    															weight: newWeeklyWeightAvg,
    															physicalActivity: newWeeklyPhysicalActivityAvg,
    															bloodPressure: newWeeklyBloodPressureAvg,
    															waistCircumference: newWeeklyWaistCircumferenceAvg,
    														},
                                total: {
    															bmi: newWeeklyBMITotal,
    															heartRate: newWeeklyHeartRateTotal,
    															weight: newWeeklyWeightTotal,
    															physicalActivity: newWeeklyPhysicalActivityTotal,
    															bloodPressure: newWeeklyBloodPressureTotal,
    															waistCircumference: newWeeklyWaistCircumferenceTotal,
    														},
                            }
                        }
                    }

                    // Commit to Firestore, update the weeklyIntakeSummary
                    transaction.update(WeeklySummaryDoc, {
    										total: {
    											bmi: newTotalBMI,
    											heartRate: newTotalHeartRate,
    											weight: newTotalWeight,
    											physicalActivity: newTotalPhysicalActivity,
    											bloodPressure: newTotalBloodPressure,
    											waistCircumference: newTotalWaistCircumference,
    										},
    										average: {
    											bmi: newAverageBMI,
    											heartRate: newAverageHeartRate,
    											weight: newAverageWeight,
    											physicalActivity: newAveragePhysicalActivity,
    											bloodPressure: newAveragePhysicalActivity,
    											waistCircumference: newAverageWaistCircumference,
    										},
    										entryCount: {
    											bmi: newBmiEntryCount,
    											heartRate: newHeartRateEntryCount,
    											weight: newWeightEntryCount,
    											physicalActivity: newPhysicalActivityEntryCount,
    											bloodPressure: newBloodPressureCount,
    											waistCircumference: newWaistCircumferenceCount,
    										},
    										heartSmartRisk: {
    											...heartSmartRiskData,
    											total: newTotalHeartSmartRisk,
    											[`${heartSmartRisk}`]: newHeartSmartRisk
    										},
                        yearlyAverage: newYearlyAverage
    				});

    				//Commit to Firestore, add new data to the weeklyIntakeSummary data
                    transaction.set(summaryDataRef, { ...data });

                    resolve();
                })
            });
      })
    }
};

export default Firebase;
