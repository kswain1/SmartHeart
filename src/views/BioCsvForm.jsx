import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import {withFirebase} from '../components/Firebase';

class BioCsv extends Component {

  handleCSVUpload = csvData => {
    let heartSmartData = [];
    let formdata;
    csvData.forEach(data => {
      formdata = {
        createdAt: data[3],
        name: [data[1], data[2]].join(' '),
        dob: data[4],
        weight: data[5],
        height: data[6],
        bmi: data[7],
        waistCircumference: data[8],
        bloodPressure: data[9],
        leftLegLength: data[10],
        rightLegLength: data[11],
        timeUpGoOne: data[12],
        timeUpGoTwo: data[13],
        timeUpGoThree: data[14],
        timeUpGoAvg: data[15],
        gaitVelocityOne: data[16],
        gaitVelocityTwo: data[17],
        gaitVelocityThree: data[18],
        gaitVelocityAvg: data[19],
        heartRate: data[20],
        physicalActvity: physicalActivty(data[21]),
        highBloodPressure: (data[22] == 'Yes') ? true : false,
        highDiabetes: (data[23] == 'Yes') ? true : false,
        highCholesterol: (data[24] == 'Yes') ? true : false,
        smokedHundredCigarettes: (data[25] == 'Yes') ? true : false,

      };

      heartSmartData.push(this.props.firebase.createBioMechanicsData(formdata));
    });

    Promise.all(heartSmartData).then()
  }

function physicalActivty(totalPhysicalActivity) {
  switch (totalPhysicalActivity) {
    case "less than 30 mins":
      return 30;
    case "30-60":
      return 60;
    case "60-90":
      return 90;
    case "90-120":
      return 120;
    case "150 or more":
      return 150;
    default:
      return 0;
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
