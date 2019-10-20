import firebase from './firebase';
import moment from 'moment';

export const initializeWeeklySummary = () => (
    {
        total: {
            bmi: Number(0),
            heartRate: Number(0),
            weight: Number(0),
            heartSmartScale: Number(0),
            physicalActivity: Number(0),
            sBloodPressure: Number(0),
            dBloodPressure: Number(0),
            waistCircumference: Number(0),

        },
        average: {
            bmi: Number(0),
            heartRate: Number(0),
            weight: Number(0),
            heartSmartScale: Number(0),
            physicalActivity: Number(0),
            sBloodPressure: Number(0),
            dBloodPressure: Number(0),
            waistCircumference: Number(0),
        },
        entryCount: {
            bmi: Number(0),
            heartRate: Number(0),
            weight: Number(0),
            heartSmartScale: Number(0),
            physicalActivity: Number(0),
            sBloodPressure: Number(0),
            dBloodPressure: Number(0),
            waistCircumference: Number(0),
        },
        heartSmartRisk: {
            total: Number(0),
            lowRisk: Number(0),
            midRisk: Number(0),
            highRisk: Number(0),
            physicalActivity: Number(0),
            sBloodPressure: Number(0),
            dBloodPressure: Number(0),
            waistCircumference: Number(0),

        },
        yearlyAverage: {}
    }
);

export const initializeWeeklyAverage = () => (
    {
        count: {
            bmi: 0,
            heartRate: 0,
            weight: 0,
            physicalActivity: 0,
            sBloodPressure: 0,
            dBloodPressure: 0,
            waistCircumference: 0,
        },
        average: {
            bmi: 0,
            heartRate: 0,
            weight: 0,
            physicalActivity: 0,
            sBloodPressure: 0,
            dBloodPressure: 0,
            waistCircumference: 0,
        },
        total: {
            bmi: 0,
            heartRate: 0,
            weight: 0,
            physicalActivity: 0,
            sBloodPressure: 0,
            dBloodPressure: 0,
            waistCircumference: 0,
        },
    }
);

export const generateWeeklySummaryData = (data, summaryData) => {
    
    //get BMI and CreatedAt from data
    let BMI = Number(data.bmi);
    let HeartRate = Number(data.heartRate);
    let Weight = Number(data.weight);
    let PhysicalActivity  = Number(data.physicalActivity);
    let SbloodPressure = Number(data.sBloodPressure);
    let DbloodPressure = Number(data.dBloodPressure);
    let WaistCircumference = Number(data.waistCircumference);
    data.createdAt = moment(data.createdAt || new Date()).format('MM-DD-YYYY');
    let dateCreated = data.createdAt;
    let heartSmartRisk = data.heartSmartRisk;//lowRisk
    
    
    //get count of heartSmartRisk
    var heartSmartRiskData = summaryData.heartSmartRisk;
    var totalHeartSmartRiskData = heartSmartRiskData.total;
    var newTotalHeartSmartRisk = totalHeartSmartRiskData + 1;
    var newHeartSmartRisk = heartSmartRiskData[heartSmartRisk] + 1;

    //get count entries
    var entryCounts = summaryData.entryCount;
    var bmiEntryCount = entryCounts.bmi;
    var heartRateEntryCount = entryCounts.heartRate;
    var weightEntryCount = entryCounts.weight;
    var physicalActivityEntryCount = entryCounts.physicalActivity;
    var sBloodPressureCount = entryCounts.sBloodPressure;
    var dBloodPressureCount = entryCounts.dBloodPressure;
    var waistCircumferenceCount = entryCounts.waistCircumference;

    var newBmiEntryCount = bmiEntryCount + 1;
    var newHeartRateEntryCount = heartRateEntryCount + 1;
    var newWeightEntryCount = weightEntryCount + 1;
    var newPhysicalActivityEntryCount = physicalActivityEntryCount + 1;
    var newSBloodPressureCount = sBloodPressureCount + 1;
    var newDBloodPressureCount = dBloodPressureCount + 1;
    var newWaistCircumferenceCount = waistCircumferenceCount + 1;

    //compute total BMI
    var total = summaryData.total;
    var newTotalBMI = total.bmi + BMI;
    var newTotalHeartRate = total.heartRate + HeartRate;
    var newTotalWeight = total.weight + Weight;
    var newTotalPhysicalActivity = total.physicalActivity + PhysicalActivity;
    var newTotalSBloodPressure = total.sBloodPressure + SbloodPressure;
    var newTotalDBloodPressure = total.dBloodPressure + DbloodPressure;
    var newTotalWaistCircumference = total.waistCircumference + WaistCircumference;

    // Compute new average BMI
    var newAverageBMI = newTotalBMI / newBmiEntryCount;
    var newAverageHeartRate = newTotalHeartRate / newHeartRateEntryCount;
    var newAverageWeight = newTotalWeight / newWeightEntryCount;
    var newAveragePhysicalActivity = newTotalPhysicalActivity / newPhysicalActivityEntryCount;
    var newAverageSBloodPressure = newTotalSBloodPressure / newSBloodPressureCount;
    var newAverageDBloodPressure = newTotalDBloodPressure / newDBloodPressureCount;
    var newAverageWaistCircumference = newTotalWaistCircumference / newWaistCircumferenceCount;

    //set yearly average
    var yearlyAverage = summaryData.yearlyAverage;
    var week = moment(dateCreated).week();
    var year = moment(dateCreated).year();
    var weekAverageData = yearlyAverage && yearlyAverage[`${year}`] && yearlyAverage[`${year}`][`${week}`] || initializeWeeklyAverage();

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

    var newWeeklySBloodPressureCount = weeklyCount.sBloodPressure + 1;
    var newWeeklySBloodPressureTotal = weeklyTotal.sBloodPressure + SbloodPressure;
    var newWeeklySBloodPressureAvg = newWeeklySBloodPressureTotal / newWeeklySBloodPressureCount;

    var newWeeklyDBloodPressureCount = weeklyCount.dBloodPressure + 1;
    var newWeeklyDBloodPressureTotal = weeklyTotal.dBloodPressure + DbloodPressure;
    var newWeeklyDBloodPressureAvg = newWeeklyDBloodPressureTotal / newWeeklyDBloodPressureCount;

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
                    sBloodPressure: newSBloodPressureCount,
                    dBloodPressure: newDBloodPressureCount,
                    waistCircumference: newWaistCircumferenceCount,
                },
                average: {
                    bmi: newWeeklyBMIAvg,
                    heartRate: newWeeklyHeartRateAvg,
                    weight: newWeeklyWeightAvg,
                    physicalActivity: newWeeklyPhysicalActivityAvg,
                    sBloodPressure: newWeeklySBloodPressureAvg,
                    dBloodPressure: newWeeklyDBloodPressureAvg,
                    waistCircumference: newWeeklyWaistCircumferenceAvg,
                },
                total: {
                    bmi: newWeeklyBMITotal,
                    heartRate: newWeeklyHeartRateTotal,
                    weight: newWeeklyWeightTotal,
                    physicalActivity: newWeeklyPhysicalActivityTotal,
                    sBloodPressure: newWeeklySBloodPressureTotal,
                    dBloodPressure: newWeeklyDBloodPressureTotal,
                    waistCircumference: newWeeklyWaistCircumferenceTotal,
                },
            }
        }
    }

    // Commit to Firestore, update the weeklyIntakeSummary
    let weeklySummaryData = {
        total: {
            bmi: newTotalBMI,
            heartRate: newTotalHeartRate,
            weight: newTotalWeight,
            physicalActivity: newTotalPhysicalActivity,
            sBloodPressure: newTotalSBloodPressure,
            dBloodPressure: newTotalDBloodPressure,
            waistCircumference: newTotalWaistCircumference,
        },
        average: {
            bmi: newAverageBMI,
            heartRate: newAverageHeartRate,
            weight: newAverageWeight,
            physicalActivity: newAveragePhysicalActivity,
            sBloodPressure: newAverageSBloodPressure,
            dBloodPressure: newAverageDBloodPressure,
            waistCircumference: newAverageWaistCircumference,
        },
        entryCount: {
            bmi: newBmiEntryCount,
            heartRate: newHeartRateEntryCount,
            weight: newWeightEntryCount,
            physicalActivity: newPhysicalActivityEntryCount,
            sBloodPressure: newSBloodPressureCount,
            dBloodPressure: newDBloodPressureCount,
            waistCircumference: newWaistCircumferenceCount,
        },
        heartSmartRisk: {
            ...heartSmartRiskData,
            total: newTotalHeartSmartRisk
        },
        yearlyAverage: newYearlyAverage
    };

    if(heartSmartRisk && newHeartSmartRisk){
        weeklySummaryData.heartSmartRisk[`${heartSmartRisk}`] = newHeartSmartRisk;
    }

    return weeklySummaryData;
}
