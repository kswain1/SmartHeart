/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
	Grid,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	FormControl,
	Form
} from "react-bootstrap";
import moment from 'moment';
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {withFirebase} from '../components/Firebase';

import avatar from "assets/img/faces/face-3.jpg";

class BiomechanicsForm extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: '',
			cholesterol: '',
			physicalActivity: '',
			bmi: '',
			weight: '',
			notes: '',
			createdAt: moment().format()
		}
	}

	componentDidMount(){
		//this.DeleteDocumentsInWeeklyIntake();
		//this.InitializeWeeklyIntake();
		this.GetAllWeeklyIntake();
	}

	/**
	 * Only use this to delete the weeklyIntake collection
	 */
	DeleteDocumentsInWeeklyIntake(){
		this.props.firebase.weeklyIntake().get().then(snapshot => {
			snapshot.forEach((doc) => {
				console.log(doc.id, doc.data())

				this.props.firebase.weeklyIntake().doc(doc.id).delete().then(function() {
					console.log("Document successfully deleted!");
				}).catch(function(error) {
					console.error("Error removing document: ", error);
				});
            });
		});
	}

	/**
	 * initalize weeklyIntake collection with a -summary- document.
	 * The summary document would hold all Biomechanics form data, and as well quick summary for easy access.
	 * P.S: Only use this if you deleted the weeklyIntake collection.
	 */
	InitializeWeeklyIntake = () => {
		this.props.firebase.weeklyIntakeSummary().set({
			totalBMI: Number(0),
			averageBMI: Number(0),
			bmiEntryCount: Number(0),
			yearlyAverage: {}
		}).then(res => {
			console.log('res from initalize', res);
		});
	}

	/**
	 * Get data from weeklyIntake collection
	 */
	GetAllWeeklyIntake = () => {
		this.props.firebase.weeklyIntake().get().then(snapshot => {
			snapshot.forEach((doc) => {
				console.log(doc.id, doc.data());
            });
		});
	}

	/**
	 * This function serves as the firestore aggregration query.
	 * It's sole purpose is to update the weeklyIntake aggregation summary.
	 * DO NOT DELETE
	 */
	CreateBioMechanicsData = (data) => {
		
		var WeeklySummaryDoc = this.props.firebase.weeklyIntakeSummary();
		var WeeklySummaryDataCollection = this.props.firebase.weeklyIntakeSummaryData().doc();
		
		// Create a reference for a new BMI, for use inside the transaction
        var summaryDataRef = WeeklySummaryDataCollection;
    
        // In a transaction, add the new bmi and update the aggregate totals
        return this.props.firebase.firestoreDB().runTransaction(transaction => {
            return transaction.get(WeeklySummaryDoc).then(res => {
                if (!res.exists) {
					throw "Document does not exist!";
                }

				//get BMI and CreatedAt from data
                var BMI = Number(data.bmi);
                var dateCreated = data.createdAt;

                //get count of BMI entries
                var bmiEntryCount = res.data().bmiEntryCount;
                var newBmiEntryCount = bmiEntryCount + 1;

                //compute total BMI
                var newTotalBMI = res.data().totalBMI + BMI;
    
                // Compute new average BMI
                var newAverageBMI = newTotalBMI / newBmiEntryCount;

                //set yearly average
                var yearlyAverage = res.data().yearlyAverage;
                var week = moment(dateCreated).week();
                var year = moment(dateCreated).year();
                var weekAverageData = yearlyAverage && yearlyAverage[`${year}`] && yearlyAverage[`${year}`][`${week}`] || {count: 0, average: 0, total: 0};

				//update weekly count, weekly total, and weekly average for this week
                var newWeeklyCount = weekAverageData.count + 1;
                var newWeeklyTotal = weekAverageData.total + BMI;
                var newWeeklyAvg = newWeeklyTotal / newWeeklyCount;
                var newYearlyAverage = {
                    ...yearlyAverage,
                    [`${year}`]: {
                        ...yearlyAverage[`${year}`],
                        [`${week}`]: {
                            count: newWeeklyCount,
                            average: newWeeklyAvg,
                            total: newWeeklyTotal
                        }
                    }
                }
                
                // Commit to Firestore, update the weeklyIntakeSummary
                transaction.update(WeeklySummaryDoc, {
                    totalBMI: newTotalBMI,
                    averageBMI: newAverageBMI,
                    bmiEntryCount: newBmiEntryCount,
                    yearlyAverage: newYearlyAverage
				});

				//Commit to Firestore, add new data to the weeklyIntakeSummary data
                transaction.set(summaryDataRef, { ...data });
            })
        });
    }

	handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Firebase instanceee', this.state);

		//submit form data to firestore and update summary
		const result = await this.CreateBioMechanicsData(this.state);
		console.log("Result", result)
	};

	handleChange = e => {
		console.log('ee target', e.target.name, 'valll', e.target.value);
		this.setState({[e.target.name]: e.target.value})
	}

	render() {
		const {name, cholesterol, physicalActivity, bmi, weight, heartRate, notes} = this.state;
		return (
			<div className="content">
				<Grid fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Edit Profile"
								content={
									<form onSubmit={this.handleSubmit} >
										<FormInputs
										ncols={["col-md-5", "col-md-3", "col-md-4"]}
										properties={[
											{
												label: "Name",
												type: "text",
												bsClass: "form-control",
												placeholder: "Name",
												value: name,
												disabled: false,
												name: 'name',
												onChange: this.handleChange
											},
											{
												label: "cholesterol",
												type: "number",
												bsClass: "form-control",
												placeholder: "cholesterol",
												value: cholesterol,
												name: 'cholesterol',
												onChange: this.handleChange
											},
											{
												label: "physicalActivity",
												type: "number",
												bsClass: "form-control",
												placeholder: "physicalActivity",
												name: 'physicalActivity',
												value: physicalActivity,
												onChange: this.handleChange
											}
										]}
										/>
										<FormInputs
										ncols={["col-md-6", "col-md-6"]}
										properties={[
											{
												label: "bmi",
												type: "number",
												bsClass: "form-control",
												placeholder: "bmi",
												value: bmi,
												name: 'bmi',
												onChange: this.handleChange
											},
											{
												label: "weight",
												type: "number",
												bsClass: "form-control",
												placeholder: "weight",
												value: weight,
												name: 'weight',
												onChange: this.handleChange
											}
										]}
										/>
										<Row>
											<Col md={12}>
												<FormGroup controlId="formControlsTextarea">
												<ControlLabel>Extra Notes</ControlLabel>
												<FormControl
													rows="5"
													componentClass="textarea"
													bsClass="form-control"
													placeholder="Here can be your description"
													value={notes}
													name='notes'
													onChange={this.handleChange}
												/>
												</FormGroup>
											</Col>
										</Row>
										<Button bsStyle="info" pullRight fill type="submit">
											Update Profile
										</Button>
										<div className="clearfix" />
									</form>
								}
							/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export default withFirebase(BiomechanicsForm);