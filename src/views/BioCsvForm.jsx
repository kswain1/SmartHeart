import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import {withFirebase} from '../components/Firebase';
import Button from "components/CustomButton/CustomButton.jsx";
import { generateHeartSmartRisk, generateHeartSmartScale } from '../helper/functions';
import './csvForm.scss';

class BioCsv extends Component {

  state = {
    csvData: []
  }

  handleCSVReader = (data) => {
    this.setState({ csvData: data });
    alert("File has been uploaded")
  }

    uploadData = async () => {
      if(window.confirm("Do you want to proceed uploading data?")){
        let { csvData } = this.state;
          let heartSmartData = [];
          let formdata, physicalActivity, heartSmartScale, heartSmartRisk, bloodPressure;
          await csvData.forEach(async (data, index) => {
              //skip the first line of the CSV data
              if(index > 0){
                  physicalActivity = await this.physicalActivity(data[21]);
                  bloodPressure = this.getBloodPressure(data[9]);
                  formdata = {
                      createdAt: data[4],
                      name: {
                        firstName: data[1],
                        lastname: data[2],
                      },
                      dob: data[3],
                      weight: Number(!isNaN(data[5]) ? data[5] : 0),
                      height: Number(!isNaN(data[6]) ? data[6] : 0),
                      bmi: Number(!isNaN(data[7]) ? data[7] : 0),
                      waistCircumference: Number(!isNaN(data[8]) ? data[8] : 0),
                      sBloodPressure: bloodPressure.sBloodPressure,
                      dBloodPressure: bloodPressure.dBloodPressure,
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

                  heartSmartScale = generateHeartSmartScale(formdata);
              		heartSmartRisk = generateHeartSmartRisk(heartSmartScale);
                  formdata.heartSmartScale = heartSmartScale;
              		formdata.heartSmartRisk = heartSmartRisk;

                  console.log("Form data", formdata);
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
      return false;
    }

    getBloodPressure = (data) => {
      const result  = data.split("/");
      const
        sBloodPressure = result.length && result[0] ? Number(!isNaN(result[0]) ? result[0] : 0) : Number(0),
        dBloodPressure = result.length  && result[1]? Number(!isNaN(result[1]) ? result[1] : 0) : Number(0);
      return {
        sBloodPressure, dBloodPressure
      }
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
                    onFileLoaded={this.handleCSVReader}
                />
                <Button bsStyle="info" fill onClick={this.uploadData}>
                  Upload CSV
                </Button>
            </div>

        )
    }
}

export default withFirebase(BioCsv);
