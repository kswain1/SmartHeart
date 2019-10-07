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
import moment from 'moment';
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
  physicalAct, //for physical activity view
  optionsPhysAct,
  legendPhysAct,
  responsivePhysAct,
} from "variables/Variables.jsx";
import {withFirebase} from '../components/Firebase';

class Dashboard extends Component {

    state = {
        averageBMI: 0,
        averageHeartRate: 0,
        averageWeight: 0,
        averagePhysicalActivity: 0,
        averageSBloodPressure: 0,
        averageWaistCircumference: 0,
        yearlyAverage: {},
        loading: false,
        currentyear: moment().year(),
        heartSeriesData: {},
        heartSeriesValues: [],
        bmiSeriesData: {},
        bmiSeriesValues: [],
        weightSeriesData: {},
        weightSeriesValues: [],
        physicalActivitySeriesData: {},
        physicalActivitySeriesValues: [],
        waistCircumferenceSeriesData: {},
        waistCircumferenceSeriesValues: [],
        bloodPressureSeriesData: {},
        bloodPressureSeriesValues: [],
        sBloodPressureSeriesData: {},
        sBloodPressureSeriesValues: [],
        heartSmartRisk: null,
        heartSmartRiskSeriesData: {},
        heartSmartRiskSeriesValues: [],
        heartSmartValue: '',
    }

    componentDidMount() {
        this.GetWeeklyIntakeSummary();
    }

    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(<i className={type} key={i} />);
            legend.push(" ");
            legend.push(json["names"][i]);
        }
        return legend;
    }

    ConvertToDecimal = (value) => {
      return parseFloat(Math.round(value * 100) / 100).toFixed(2);
    }

    /**
     * Get summary data from weeklyIntake collection
     */
    GetWeeklyIntakeSummary = () => {
      const { currentyear } = this.state;
      this.props.firebase.weeklyIntakeSummary().get().then(summary => {
        if(summary && summary.id){
          var { average, yearlyAverage, heartSmartRisk } = summary.data();
          var currentYearData = yearlyAverage && yearlyAverage[currentyear];
          this.setState({
                yearlyAverage: yearlyAverage,
                currentYearData: currentYearData,
                heartSmartRisk: heartSmartRisk,
                averageBMI: this.ConvertToDecimal(average.bmi),
                averageWeight: this.ConvertToDecimal(average.weight),
                averageHeartRate: this.ConvertToDecimal(average.heartRate),
                averagePhysicalActivity: this.ConvertToDecimal(average.physicalActivity),
                averageBloodPressure: this.ConvertToDecimal(average.sBloodPressure),
                averageWaistCircumference: this.ConvertToDecimal(average.waistCircumference),
                averageSBloodPressure: this.ConvertToDecimal(average.sBloodPressure),
          }, () => {
            //computes data in form for graphs
            this.createHeartRateSeriesData();
            this.createBMISeriesData();
            this.createWeightSeriesData();
            this.createHeartSmartSeriesData();
            this.createSBloodPressureSeriesData();
            this.checkHeartRateScale();
            this.createPhysicalActivitySeriesData();
            this.createWaistCircumferenceSeriesData();

          })
        }
      });
	}

    createHeartRateSeriesData = () => {
      const { currentYearData } = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const heartSeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `Week ${label}`;
      });

      const heartSeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.heartRate;
      });

      const heartSeriesData = {
        labels: heartSeriesLabels,
        series: [ heartSeriesValues, ]
      }

      console.log('Heart series data', heartSeriesData);

      this.setState({ heartSeriesData, heartSeriesValues })
    }

    createBMISeriesData = () => {
      const { currentYearData } = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const bmiSeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `${label}`;
      });

      const bmiSeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.bmi;
      });

      const bmiSeriesData = {
        labels: bmiSeriesLabels,
        series: [ bmiSeriesValues, ]
      }

      console.log('bmi series data', bmiSeriesData);

      this.setState({ bmiSeriesData, bmiSeriesValues })
    }

    createWaistCircumferenceSeriesData = () => {
      const { currentYearData } = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const waistCircumferenceSeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `${label}`;
      });

      const waistCircumferenceSeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.waistCircumference;
      });

      const waistCircumferenceSeriesData = {
        labels: waistCircumferenceSeriesLabels,
        series: [ waistCircumferenceSeriesValues, ]
      }

      console.log('Waist Circumference', waistCircumferenceSeriesData);

      this.setState({ waistCircumferenceSeriesData, waistCircumferenceSeriesValues })
    }

    createWeightSeriesData = () => {
      const { currentYearData } = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const weightSeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `${label}`;
      });

      const weightSeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.weight;
      });

      const weightSeriesData = {
        labels: weightSeriesLabels,
        series: [ weightSeriesValues, ]
      }

      console.log('weight series data', weightSeriesData);

      this.setState({ weightSeriesData, weightSeriesValues })
    }

    createSBloodPressureSeriesData = () => {
      const { currentYearData } = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const sBloodPressureSeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `${label}`;
      });

      const sBloodPressureSeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.sBloodPressure;
      });

      const sBloodPressureSeriesData = {
        labels: sBloodPressureSeriesLabels,
        series: [ sBloodPressureSeriesValues, ]
      }

      console.log('sBloodPressure Series Data', sBloodPressureSeriesData);

      this.setState({ sBloodPressureSeriesValues, sBloodPressureSeriesData })
    }

    createPhysicalActivitySeriesData = () => {
      const {currentYearData} = this.state;
      const labels = currentYearData && Object.keys(currentYearData);
      const values = currentYearData && Object.values(currentYearData);

      const physicalActivitySeriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
        return `${label}`;
      });

      const physicalActivitySeriesValues = values && values.length > 0 && values.map((value, index) => {
        return value.average.physicalActivity;
      });

      const physicalActivityData = {
        labels: physicalActivitySeriesLabels,
        values: [physicalActivitySeriesValues, ]
      }
    }

    createHeartSmartSeriesData = () => {
      const { heartSmartRisk } = this.state;
      const labels = heartSmartRisk && Object.keys(heartSmartRisk);
      const values = heartSmartRisk && Object.values(heartSmartRisk);

      var { total, highRisk, lowRisk, midRisk } = heartSmartRisk;
      var highRiskPercent = this.ConvertToDecimal( (highRisk / total) * 100 );
      var midRiskPercent = this.ConvertToDecimal( (midRisk / total) * 100 );
      var lowRiskPercent = this.ConvertToDecimal( (lowRisk / total) * 100 );
      var heartSmartRiskSeriesData = {
        labels: [`${lowRiskPercent}%`, `${midRiskPercent}%`, `${highRiskPercent}%`],
        series: [lowRiskPercent, midRiskPercent, highRiskPercent]
      };

      console.log('hs series data', heartSmartRiskSeriesData);
      this.setState({ heartSmartRiskSeriesData, heartSmartRiskSeriesValues: values });
    }

    checkHeartRateScale = () => {
      var heartSmartValue = this.state;

      const { heartSmartRisk} = this.state;
      const values = heartSmartRisk && Object.values(heartSmartRisk);

      var {total, highRisk, lowRisk, midRisk } = heartSmartRisk;
      var highRiskPercent = this.ConvertToDecimal((highRisk/total) * 100);
      var midRiskPercent = this.ConvertToDecimal((midRisk/total) * 100);
      var lowRiskPercent = this.ConvertToDecimal((lowRisk/total) * 100);

      if (highRiskPercent >= midRiskPercent && highRisk >= lowRiskPercent) {
          console.log('High Risk')
          heartSmartValue = 'High Risk'
          this.setState({heartSmartValue})
        }
      else if (midRiskPercent >= lowRiskPercent && midRiskPercent > highRiskPercent) {
          heartSmartValue = 'Mid Risk'
          this.setState({heartSmartValue})
        }
      else if (lowRiskPercent > midRiskPercent){
        heartSmartValue = 'Low Risk'
        this.setState({heartSmartValue})
      }

    }

    render() {
        const { averageBMI, averageWeight, averageHeartRate, yearlyAverage,
           heartSeriesData, heartSeriesValues, currentyear, bmiSeriesData,
            bmiSeriesValues, weightSeriesData, weightSeriesValues ,
            heartSmartRiskSeriesData, heartSmartRiskSeriesValues, heartSmartValue,
            averagePhysicalActivity, averageBloodPressure, averageWaistCircumference,
            physicalActivitySeriesData, physicalActivitySeriesValues,
            waistCircumferenceSeriesData, waistCircumferenceSeriesLabels,
            sBloodPressureSeriesData,

          } = this.state;


        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                    {
                      heartSmartRiskSeriesData && heartSmartRiskSeriesValues && heartSmartRiskSeriesValues.length > 0 &&
                      <Col lg={3} sm={6}>
                          <StatsCard
                              bigIcon={<i className="fa fa-heartbeat text-danger" />}
                              statsText="Heart Scale Rating"
                              statsValue={heartSmartValue}
                              statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Updated now"
                          />
                      </Col>
                    }
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-like text-warning" />}
                                statsText="Avg. Blood Pressure"
                                statsValue={averageBloodPressure}
                                statsIcon={<i className="fa fa-refresh" />}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-smile text-success" />}
                                statsText="Avg. Physical Activity"
                                statsValue={averagePhysicalActivity}
                                statsIcon={<i className="fa fa-refresh" />}
                                statsIconText="Last day"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-gleam text-danger" />}
                                statsText="Avg. Waist Circumference"
                                statsValue={averageWaistCircumference}
                                statsIcon={<i className="fa fa-clock-o" />}
                                statsIconText="In the last hour"
                            />
                        </Col>
                    </Row>

                    <Row>
                        {
                          heartSeriesData && heartSeriesValues && heartSeriesValues.length > 0 && <Col md={8}>
                            <Card
                                statsIcon="fa fa-history"
                                id="chartHours"
                                title="Physical Activity"
                                category="12 week cohort performance"
                                stats="Updated 3 minutes ago"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                    data={heartSeriesData}
                                    type="Line"
                                    options={optionsSales}
                                    responsiveOptions={responsiveSales}
                                    />
                                </div>
                                }
                                legend={
                                <div className="legend">{this.createLegend(legendSales)}</div>
                                }
                            />
                          </Col>
                        }

                        {
                          heartSmartRiskSeriesData && heartSmartRiskSeriesValues && heartSmartRiskSeriesValues.length > 0 &&
                          <Col md={4}>
                            <Card
                                statsIcon="fa fa-clock-o"
                                title="Heart Smart Scale Chart"
                                category="Last Phase Performance"
                                stats="Phase sent 2 days ago"
                                content={
                                <div
                                    id="chartPreferences"
                                    className="ct-chart ct-perfect-fourth"
                                >
                                    <ChartistGraph data={heartSmartRiskSeriesData} type="Pie" />
                                </div>
                                }
                                legend={
                                <div className="legend">{this.createLegend(legendPie)}</div>
                                }
                            />
                        </Col>
                      }
                    </Row>

                    <Row>
                      { weightSeriesData && weightSeriesValues && weightSeriesValues.length > 0 &&
                        <Col md={6}>
                            <Card
                                id="weightActivity"
                                title="Waist Circumference"
                                category="Collective information from Cohort 1"
                                stats="Data information certified"
                                statsIcon="fa fa-check"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                    data={waistCircumferenceSeriesData}
                                    type="Bar"
                                    options={optionsBar}
                                    responsiveOptions={responsiveBar}
                                    />
                                </div>
                                }
                                legend={
                                <div className="legend">{this.createLegend(legendBar)}</div>
                                }
                            />
                        </Col>
                      }

                        <Col md={6}>
                          { bmiSeriesData && bmiSeriesValues && bmiSeriesValues.length > 0 &&
                            <Card
                                title="Blood Pressure Over Week"
                                category="Cohort 1"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                        data={sBloodPressureSeriesData}
                                        type="Line"
                                        options={optionsPhysAct}
                                        responsiveOptions={responsivePhysAct}
                                    />
                                </div>
                                }
                                legend={
                                <div className="legend">{this.createLegend(legendPhysAct)}</div>
                                }
                            />
                          }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withFirebase(Dashboard);
