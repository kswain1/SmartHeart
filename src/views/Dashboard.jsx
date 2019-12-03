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
import { average, createMapPressure } from "helper/functions.jsx"
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

    _isMounted = false;

    constructor(props){
      super(props);
      this.state = {
          currentUser: null,
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
          mapValues: {},

      }
    }

    componentDidMount() {
        this._isMounted = true;

        //this.setCurrentUser();
        // if acccessLevel === "user"
        // getuserdata
        // else { getWeeklyIntakeSummary}
        this.props.firebase.getUserDoc(localStorage.getItem("email")).get().then(summary => {
          console.log(summary)
          console.log("summary data", summary.data)
        });
        this.GetWeeklyIntakeSummary();

    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    setCurrentUser = () => {
      if(this._isMounted){
        return this.props.firebase.onAuthStateChanged(user => this.setState({ currentUser: user }))
      }
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
          var mapsValue = createMapPressure(currentYearData);
          this.setState({
                yearlyAverage: yearlyAverage,
                currentYearData: currentYearData,
                heartSmartRisk: heartSmartRisk,
                averageBMI: this.ConvertToDecimal(average.bmi),
                averageWeight: this.ConvertToDecimal(average.weight),
                averageHeartRate: this.ConvertToDecimal(average.heartRate),
                averagePhysicalActivity: this.ConvertToDecimal(average.physicalActivity),
                averageDBloodPressure: this.ConvertToDecimal(average.dBloodPressure),
                averageWaistCircumference: this.ConvertToDecimal(average.waistCircumference),
                averageSBloodPressure: this.ConvertToDecimal(average.sBloodPressure),
                mapValues: mapsValue,
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

    //general function to create chart series data
    generateChartData = ({data, labelPrefix = '', identifier, labelsIdentifier, valuesIdentifier}) => {
        const labels = data && Object.keys(data);
        const values = data && Object.values(data);

        const seriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
            return `${labelPrefix} ${label}`;
        });

        const seriesValues = values && values.length > 0 && values.map((value, index) => {
            return value.average[identifier];
        });

        const seriesData = {
            labels: seriesLabels,
            series: [ seriesValues, ]
        }

        console.log(`${identifier} Series data === `, seriesData);

        this.setState({
            [labelsIdentifier]: seriesData,
            [valuesIdentifier]: seriesValues
        })
    }

    createHeartRateSeriesData = () => {
        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            labelPrefix: 'Week ',
            identifier: 'heartRate',
            labelsIdentifier: 'heartSeriesData',
            valuesIdentifier: 'heartSeriesValues'
        })

    }

    createBMISeriesData = () => {
        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            identifier: 'bmi',
            labelsIdentifier: 'bmiSeriesData',
            valuesIdentifier: 'bmiSeriesValues'
        })
    }

    createWaistCircumferenceSeriesData = () => {

        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            identifier: 'waistCircumference',
            labelsIdentifier: 'waistCircumferenceSeriesData',
            valuesIdentifier: 'waistCircumferenceSeriesValues'
        })
    }

    createWeightSeriesData = () => {
        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            identifier: 'weight',
            labelsIdentifier: 'weightSeriesData',
            valuesIdentifier: 'weightSeriesValues'
        })
    }

    createSBloodPressureSeriesData = () => {
        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            identifier: 'sBloodPressure',
            labelsIdentifier: 'sBloodPressureSeriesData',
            valuesIdentifier: 'sBloodPressureSeriesValues'
        })
    }

    createPhysicalActivitySeriesData = () => {
        const { currentYearData } = this.state;
        this.generateChartData({
            data: currentYearData,
            identifier: 'physicalActivity',
            labelsIdentifier: 'physicalActivityData',
            valuesIdentifier: 'physicalActivitySeriesValues'
        })
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
          labels: [`${lowRiskPercent}%`, `${highRiskPercent}%`,`${midRiskPercent}%` ],
          series: [lowRiskPercent, highRiskPercent, midRiskPercent ]
        };

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
            sBloodPressureSeriesData, mapValues, mapValueSeriesData, mapValueAverage
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
                                statsText="Avg. MAP Blood Pressure"
                                statsValue={mapValues.mapAverage}
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
                          { bmiSeriesData && mapValues  &&
                            <Card
                                title="Map Blood Pressure Over Week"
                                category="Cohort 1"
                                statsIcon="fa fa-history"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                        data={mapValues.mapValueSeriesData}
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
