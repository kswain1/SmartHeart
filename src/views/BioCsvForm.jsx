import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import {withFirebase} from '../components/Firebase';

class BioCsv extends Component {

  handleCSVUpload = data => {
    console.log(data);
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
