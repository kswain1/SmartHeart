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

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {withFirebase} from '../components/Firebase';

import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends Component {
  state = {
    company: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    physicalActivity: '',
    dob: '',
    weight: '',
    about: ''
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log('Firebase instanceee', this.state);


    this.props.firebase.enrollmentForms().add(this.state).then(res => {
      console.log('res from add', res);
    });

    //this.setState({company: e.target.value});
  };

  handleChange = e => {
    console.log('ee target', e.target.name, 'valll', e.target.value);
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    const {company, username, email, firstName, lastName, address, physicalActivity, dob, weight, about} = this.state;
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
                          label: "Company",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Company",
                          value: company,
                          disabled: false,
                          name: 'company',
                          onChange: this.handleChange
                        },
                        {
                          label: "Username",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Username",
                          value: username,
                          name: 'username',
                          onChange: this.handleChange
                        },
                        {
                          label: "Email address",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          name: 'email',
                          value: email,
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      properties={[
                        {
                          label: "First name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "First name",
                          value: firstName,
                          name: 'firstName',
                          onChange: this.handleChange
                        },
                        {
                          label: "Last name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Last name",
                          value: lastName,
                          name: 'lastName',
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Address",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Home Address",
                          value: address,
                          name: 'address',
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      properties={[
                        {
                          label: "Physical Activity",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Physical Activity",
                          value: physicalActivity,
                          name: 'physicalActivity',
                          onChange: this.handleChange
                        },
                        {
                          label: "Date of Birth",
                          type: "date",
                          bsClass: "form-control",
                          placeholder: "Date of Birth",
                          value: dob,
                          name: 'dob',
                          onChange: this.handleChange
                        },
                        {
                          label: "Weight",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "175",
                          name: 'weight',
                          value: weight,
                          onChange: this.handleChange
                        }
                      ]}
                    />

                    <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>About Me</ControlLabel>
                          <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Here can be your description"
                            value={about}
                            name='about'
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
            {/*<Col md={4}>*/}
            {/*  <UserCard*/}
            {/*    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"*/}
            {/*    avatar={avatar}*/}
            {/*    name="Mike Andrew"*/}
            {/*    userName="michael24"*/}
            {/*    description={*/}
            {/*      <span>*/}
            {/*        "Lamborghini Mercy*/}
            {/*        <br />*/}
            {/*        Your chick she so thirsty*/}
            {/*        <br />*/}
            {/*        I'm in that two seat Lambo"*/}
            {/*      </span>*/}
            {/*    }*/}
            {/*    socials={*/}
            {/*      <div>*/}
            {/*        <Button simple>*/}
            {/*          <i className="fa fa-facebook-square" />*/}
            {/*        </Button>*/}
            {/*        <Button simple>*/}
            {/*          <i className="fa fa-twitter" />*/}
            {/*        </Button>*/}
            {/*        <Button simple>*/}
            {/*          <i className="fa fa-google-plus-square" />*/}
            {/*        </Button>*/}
            {/*      </div>*/}
            {/*    }*/}
            {/*  />*/}
            {/*</Col>*/}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withFirebase(UserProfile);
