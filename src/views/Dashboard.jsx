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
        yearlyAverage: {},
        loading: false,
        currentyear: moment().year(),
        heartSeriesData: {},
        heartSeriesValues: [],
        bmiSeriesData: {},
        bmiSeriesValues: [],
        weightSeriesData: {},
        weightSeriesValues: [],
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

    /**
     * Get summary data from weeklyIntake collection
     */
    GetWeeklyIntakeSummary = () => {
      const { currentyear } = this.state;
      this.props.firebase.weeklyIntakeSummary().get().then(summary => {
        if(summary && summary.id){
          var { average, yearlyAverage } = summary.data();
          var currentYearData = yearlyAverage && yearlyAverage[currentyear];
          this.setState({
                yearlyAverage: yearlyAverage,
                currentYearData: currentYearData,
                averageBMI: parseFloat(Math.round(average.bmi * 100) / 100).toFixed(2),
                averageWeight: parseFloat(Math.round(average.weight * 100) / 100).toFixed(2),
                averageHeartRate: parseFloat(Math.round(average.heartRate * 100) / 100).toFixed(2),
          }, () => {
            //computes data in form for graphs
            this.createHeartRateSeriesData();
            this.createBMISeriesData();
            this.createWeightSeriesData();

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

    render() {
        const { averageBMI, averageWeight, averageHeartRate, yearlyAverage,
           heartSeriesData, heartSeriesValues, currentyear, bmiSeriesData,
            bmiSeriesValues, weightSeriesData, weightSeriesValues } = this.state;


        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-like text-warning" />}
                                statsText="Avg. Heart Rate"
                                statsValue={averageHeartRate}
                                statsIcon={<i className="fa fa-refresh" />}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-smile text-success" />}
                                statsText="Avg. BMI"
                                statsValue={averageBMI}
                                statsIcon={<i className="fa fa-refresh" />}
                                statsIconText="Last day"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-gleam text-danger" />}
                                statsText="Avg. Weight"
                                statsValue={averageWeight}
                                statsIcon={<i className="fa fa-clock-o" />}
                                statsIconText="In the last hour"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="fa fa-heartbeat text-danger" />}
                                statsText="Blood Pressue"
                                statsValue="150"
                                statsIcon={<i className="fa fa-refresh" />}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>

                    <Row>
                        {
                          heartSeriesData && heartSeriesValues && heartSeriesValues.length > 0 && <Col md={8}>
                            <Card
                                statsIcon="fa fa-history"
                                id="chartHours"
                                title="Heart Rate Chart"
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
                        <Col md={4}>
                            <Card
                                statsIcon="fa fa-clock-o"
                                title="Cohort Phase Performance Average"
                                category="Last Phase Performance"
                                stats="Phase sent 2 days ago"
                                content={
                                <div
                                    id="chartPreferences"
                                    className="ct-chart ct-perfect-fourth"
                                >
                                    <ChartistGraph data={dataPie} type="Pie" />
                                </div>
                                }
                                legend={
                                <div className="legend">{this.createLegend(legendPie)}</div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                      { weightSeriesData && weightSeriesValues && weightSeriesValues.length > 0 &&
                        <Col md={6}>
                            <Card
                                id="weightActivity"
                                title="Weight Activity"
                                category="Collective information from Cohort 1"
                                stats="Data information certified"
                                statsIcon="fa fa-check"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                    data={weightSeriesData}
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
                                title="BMI Activity Per Week"
                                category="Cohort 1"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
                                content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                        data={bmiSeriesData}
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
