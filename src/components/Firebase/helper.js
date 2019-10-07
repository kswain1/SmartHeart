import firebase from './firebase';
import moment from 'moment';

const CreateBioMechanicsData = (data) => {

    var WeeklySummaryDoc = firebase.weeklyIntakeSummary;
    var WeeklySummaryDataCollection = firebase.weeklyIntakeSummaryData.doc();

    // Create a reference for a new BMI, for use inside the transaction
        var summaryDataRef = WeeklySummaryDataCollection;

        // In a transaction, add the new bmi and update the aggregate totals
        return firebase.firestoreDB().runTransaction(transaction => {
            return transaction.get(WeeklySummaryDoc).then(res => {
                if (!res.exists) {
                  throw "Document does not exist";
                }

        //get BMI and CreatedAt from data
                var BMI = Number(data.bmi);
                var HeartRate = Number(data.heartRate);
                var Weight = Number(data.weight);
                var dateCreated = data.createdAt;
                var heartSmartRisk = data.heartSmartRisk;//lowRisk

                //get count of heartSmartRisk
                var heartSmartRiskData = res.data().heartSmartRisk;
                var totalHeartSmartRiskData = heartSmartRiskData.total;
                var newTotalHeartSmartRisk = totalHeartSmartRiskData + 1;
                var newHeartSmartRisk = heartSmartRiskData[heartSmartRisk] + 1;

                //get count of BMI entries
                var entryCounts = res.data().entryCount;
                var bmiEntryCount = entryCounts.bmi;
                var heartRateEntryCount = entryCounts.heartRate;
                var weightEntryCount = entryCounts.weight;

                var newBmiEntryCount = bmiEntryCount + 1;
                var newHeartRateEntryCount = heartRateEntryCount + 1;
                var newWeightEntryCount = weightEntryCount + 1;

                //compute total BMI
                var total = res.data().total;
                var newTotalBMI = total.bmi + BMI;
                var newTotalHeartRate = total.heartRate + HeartRate;
                var newTotalWeight = total.weight + Weight;

                // Compute new average BMI
                var newAverageBMI = newTotalBMI / newBmiEntryCount;
                var newAverageHeartRate = newTotalHeartRate / newHeartRateEntryCount;
                var newAverageWeight = newTotalWeight / newWeightEntryCount;


                //set yearly average
                var yearlyAverage = res.data().yearlyAverage;
                var week = moment(dateCreated).week();
                var year = moment(dateCreated).year();
                var weekAverageData = yearlyAverage && yearlyAverage[`${year}`] && yearlyAverage[`${year}`][`${week}`] || {
                    count: {
                      bmi: 0,
                      heartRate: 0,
                      weight: 0
                    },
                    average: {
                      bmi: 0,
                      heartRate: 0,
                      weight: 0
                    },
                    total: {
                      bmi: 0,
                      heartRate: 0,
                      weight: 0
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

                var newYearlyAverage = {
                    ...yearlyAverage,
                    [`${year}`]: {
                        ...yearlyAverage[`${year}`],
                        [`${week}`]: {
                            count: {
                              bmi: newWeeklyBMICount,
                              heartRate: newWeeklyHeartRateCount,
                              weight: newWeeklyWeightCount
                            },
                            average: {
                              bmi: newWeeklyBMIAvg,
                              heartRate: newWeeklyHeartRateAvg,
                              weight: newWeeklyWeightAvg
                            },
                            total: {
                              bmi: newWeeklyBMITotal,
                              heartRate: newWeeklyHeartRateTotal,
                              weight: newWeeklyWeightTotal
                            },
                        }
                    }
                }

                // Commit to Firestore, update the weeklyIntakeSummary
                transaction.update(WeeklySummaryDoc, {
                    total: {
                      bmi: newTotalBMI,
                      heartRate: newTotalHeartRate,
                      weight: newTotalWeight
                    },
                    average: {
                      bmi: newAverageBMI,
                      heartRate: newAverageHeartRate,
                      weight: newAverageWeight
                    },
                    entryCount: {
                      bmi: newBmiEntryCount,
                      heartRate: newHeartRateEntryCount,
                      weight: newWeightEntryCount
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
            })
        });
}

export {
  CreateBioMechanicsData
};
