import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import {withFirebase} from '../components/Firebase';
import './csvForm.scss';

class BioCsv extends Component {

    handleCSVUpload = async (csvData) => {
        let heartSmartData = [];
        let formdata, physicalActivity;
        await csvData.forEach(async (data, index) => {
            //skip the first line of the CSV data
            if(index > 0){
                physicalActivity = await this.physicalActivity(data[21]);
                formdata = {
                    createdAt: data[3],
                    name: [data[1], data[2]].join(' '),
                    dob: data[4],
                    weight: Number(!isNaN(data[5]) ? data[5] : 0),
                    height: Number(!isNaN(data[6]) ? data[6] : 0),
                    bmi: Number(!isNaN(data[7]) ? data[7] : 0),
                    waistCircumference: Number(!isNaN(data[8]) ? data[8] : 0),
                    bloodPressure: Number(!isNaN(data[9]) ? data[9] : 0),
                    leftLegLength: Number(!isNaN(data[10]) ? data[10] : 0),
                    rightLegLength: Number(!isNaN(data[11]) ? data[11] : 0),
                    timeUpGoOne: Number(!isNaN(data[12]) ? data[12] : 0),
                    timeUpGoTwo: Number(!isNaN(data[13]) ? data[13] : 0),
                    timeUpGoThree: Number(!isNaN(data[14]) ? data[14] : 0),
                    timeUpGoAvg: Number(!isNaN(data[15]) ? data[15] : 0),
                    gaitVelocityOne: Number(!isNaN(data[16]) ? data[16] : 0),
                    gaitVelocityTwo: Number(!isNaN(data[17]) ? data[17] : 0),
                    gaitVelocityThree: Number(!isNaN(data[18]) ? data[18] : 0),
                    gaitVelocityAvg: Number(!isNaN(data[19]) ? data[19] : 0),
                    heartRate: Number(!isNaN(data[20]) ? data[20] : 0),
                    physicalActivity: physicalActivity,
                    highBloodPressure: (data[22] == 'Yes') ? true : false,
                    highDiabetes: (data[23] == 'Yes') ? true : false,
                    highCholesterol: (data[24] == 'Yes') ? true : false,
                    smokedHundredCigarettes: (data[25] == 'Yes') ? true : false,

                };
                //console.log("Form data", formdata);
                heartSmartData.push(formdata);
            }
        });

        //run the createBioMechanicsData on all data in heartSmartData
        let dataPromises = heartSmartData.map(this.props.firebase.createBioMechanicsData);

        //dataPromises returns a promise for each data. Run all promises.
        Promise.all(dataPromises).then(response => {
            console.log("response", response);
        }).catch(err => {
            console.log("error", err);
        });
    }

    physicalActivity = (totalPhysicalActivity) => {
        switch (totalPhysicalActivity) {
            case "Less than 30 minutes":
                return Number(30);
            case "30-60":
                return Number(60);
            case "60-90":
                return Number(90);
            case "90-120":
                return Number(120);
            case "150 or more":
                return Number(150);
            default:
                return Number(0);
        }
    }

    render () {
        return (
            <div className="content">
                <CSVReader
                    cssClass="csv-input"
                    label="Select a CSV file"
                    onFileLoaded={this.handleCSVUpload}
                />
            </div>
        )
    }
}

export default withFirebase(BioCsv);
