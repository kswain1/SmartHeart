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

const initalState = {
	name: '',
	cholesterol: '',
	physicalActivity: '',
	bmi: '',
	weight: '',
	heartRate: '',
	height: '',
	bloodPressure: '',
	smoking: '',
	notes: '',
	createdAt: moment().format(),
	gait: '',
	timeUpGo: '',
	heartSmartScale: '',
	heartSmartRisk: '',
	diabetes: '',
	waistCircumference: '',
};

class BiomechanicsForm extends Component {

	constructor(props){
		super(props);
		this.state = initalState;
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
			total: {
				bmi: Number(0),
				heartRate: Number(0),
				weight: Number(0),
				heartSmartScale: Number(0)
			},
			average: {
				bmi: Number(0),
				heartRate: Number(0),
				weight: Number(0),
				heartSmartScale: Number(0)
			},
			entryCount: {
				bmi: Number(0),
				heartRate: Number(0),
				weight: Number(0),
				heartSmartScale: Number(0)
			},
			heartSmartRisk: {
				total: Number(0),
				lowRisk: Number(0),
				midRisk: Number(0),
				highRisk: Number(0),
			},
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


		// High blood pressure (2 pts.) bp >= 190 = 2 else x = 0
          // • High cholesterol (2 pts.) cholesterol >= cholesterolHigh x = 2 else x = 0
          // • Smoking (2 pts.) isSmoking:
          //                   x  = 2 else: x = 0
          // • Diabetes (1) diabete = diabetesHigh 150 x = 1 else x  0
          // • BMI (1) if bmi >= bmiHigh {x = 1}
          // • Waist Circumference (1) if waist >= waistHigh  x = 1 else x = 0
          // • Physical Inactivity (1 or -1) if physicalAct >= physicalActHigh x = 1 if else physicalAct <= physicalActLow x = -1
          //   else:
          //     x = 0
		//
		// Less than 3 points = low risk
		// Between 3-5 points = moderate risk
		// 6+ points = high risk

	generateHeartSmartRisk = (value) => {
		if(value < 3) { return 'lowRisk' }
		else if(value >=3 && value <=5) { return 'midRisk' }
		else { return 'highRisk' }
	}

	generateHeartSmartScale = () => {
		const { bloodPressure, cholesterol, smoking, diabetes, bmi, waistCircumference, physicalActivity } = this.state;

		var points = [
			(bloodPressure && bloodPressure >= 190) ? 2 : 0,
			(cholesterol && cholesterol >= 200) ? 2 : 0,
			(smoking == 1 || smoking == "1") ? 2 : 0,
			(bmi && bmi >= 18.5) ? 1 : 0,
			(waistCircumference && waistCircumference >= 36) ? 1 : 0,
			(physicalActivity && physicalActivity >= 60) ? -1 : ((physicalActivity && physicalActivity <= 30) ? 1 : 0),
			(diabetes == 1 || diabetes == "1") ? 1 : 0,
		];

		//summing up the variables
		var sum = points.reduce((a, b) => a + b);
		return sum;
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Firebase instanceee', this.state);

		//generateHeartSmartScale
		var heartSmartScale = await this.generateHeartSmartScale();
		var heartSmartRisk = await this.generateHeartSmartRisk(heartSmartScale);
		console.log("Heart Smart Scale", heartSmartScale);
		console.log("Heart Smart Risk", heartSmartRisk);

		var formData = this.state;
		formData['heartSmartScale'] = heartSmartScale;
		formData['heartSmartRisk'] = heartSmartRisk;

		this.setState(initalState, async () => {
			//submit form data to firestore and update summary
			const result = await this.CreateBioMechanicsData(formData);
			console.log("Result", result);
		});
	};

	handleChange = e => {
		console.log('ee target', e.target.name, 'val', e.target.value);
		this.setState({[e.target.name]: e.target.value})
	}

	render() {
		const {name, cholesterol, physicalActivity, bmi, weight, heartRate, height,
			 bloodPressure, smoking, notes, gait, createdAt, timeUpGo, diabetes, waistCircumference} = this.state;
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
										ncols={["col-md-4", "col-md-4", "col-md-4"]}
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
											},
											{
												label: "heartRate",
												type: "number",
												bsClass: "form-control",
												placeholder: "Heart Rate",
												value: heartRate,
												name: 'heartRate',
												onChange: this.handleChange
											}
										]}
										/>
										<FormInputs
										ncols={["col-md-4", "col-md-4", "col-md-4"]}
										properties={[
											{
												label: "height",
												type: "number",
												bsClass: "form-control",
												placeholder: "Height",
												value: height,
												name: 'height',
												onChange: this.handleChange
											},
											{
												label: "bloodPressure",
												type: "number",
												bsClass: "form-control",
												placeholder: "Blood Pressure",
												value: bloodPressure,
												name: 'bloodPressure',
												onChange: this.handleChange
											},
											{
												label: "smoking",
												type: "number",
												bsClass: "form-control",
												placeholder: "smoking",
												value: smoking,
												name: 'smoking',
												onChange: this.handleChange
											}
										]}
										/>
										<FormInputs
										ncols={["col-md-4", "col-md-4", "col-md-4"]}
										properties={[
											{
												label: "createdAt",
												type: "date",
												bsClass: "form-control",
												placeholder: "Date Added",
												value: createdAt,
												name: 'createdAt',
												onChange: this.handleChange
											},
											{
												label: "Gait",
												type: "number",
												bsClass: "form-control",
												placeholder: "Gait",
												value: gait,
												name: 'gait',
												onChange: this.handleChange
											},
											{
												label: "Time Up and Go",
												type: "number",
												bsClass: "form-control",
												placeholder: "TimeUpGo",
												value: timeUpGo,
												name: 'timeUpGo',
												onChange: this.handleChange
											}
										]}
										/>
										<FormInputs
										ncols={["col-md-4", "col-md-4", "col-md-4"]}
										properties={[
											{
												label: "diabetes",
												type: "number",
												bsClass: "form-control",
												placeholder: "Diabetes",
												value: diabetes,
												name: 'diabetes',
												onChange: this.handleChange
											},
											{
												label: "Waist Circumference",
												type: "number",
												bsClass: "form-control",
												placeholder: "Waist Circumference",
												value: waistCircumference,
												name: 'waistCircumference',
												onChange: this.handleChange
											},
											{
												label: "",
												type: "number",
												bsClass: "form-control",
												placeholder: "TimeUpGo",
												value: 0,
												name: 'timeUpGo',
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
