import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import './SignIn.scss'

import { withFirebase } from '../Firebase';
import { initializeWeeklySummary } from '../Firebase/helper';

const SignUpPage = () => (
  <div><SignUpForm /></div>
);

const initState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  accessLevel: 'user',
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const _this = this;
    const {username, password, email, firstName, lastName, accessLevel} = this.state;
    this.props.firebase.doCreateUserWithEmailAndPassword(email, password)
    .then(async (authUser) => {
      console.log('auth user', authUser);
      localStorage.setItem('uid', authUser.user.uid);
      localStorage.setItem('token', authUser.user.ra);
      localStorage.setItem('email', authUser.user.email);
      let user = this.props.firebase.currentUser();
      console.log("User", user);
      //update user's data
      user.updateProfile({
        accessLevel
      });

      //check if user exists
      let getUser = await this.props.firebase.getUserDoc(email).get().then(userDoc => {
          if(userDoc.exists) return { exists: true, data: userDoc.data() };
          return { exists: false };
      });

      if(!getUser.exists){
        //creat the new user
        let initialSummary = initializeWeeklySummary();
        this.props.firebase.getUserDoc(email).set({
          firstName, lastName, email, accessLevel,
          summary: initialSummary
        });
      }

      return _this.setState({loginSuccessful: true});

    }).catch((err) => {
      console.log('auth errr', err);
      //TODO
    });
  }

  render() {
    const {firstName, lastName, username, email, password, passwordConfirm, error, loginSuccessful} = this.state;
    const isValid = email && username && password === passwordConfirm;

    if(loginSuccessful){
      return window.location.href = 'user/dashboard';
    }

    return (
      <Fragment>
      <div className="loginheader">
        <div className="logo text-center">
          <img src="/heartLogo.png" height="50"/>
        </div>
        <div className="title col-md-6">
          <h2></h2>
        </div>
      </div>
      <div className="loginbg">
        <div className="container">
        <form onSubmit={this.handleFormSubmit} className="form-signin">
        <div className="input-field">
          <input
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
            type="text"
            placeholder="First Name"
            className="form-control"
          />
        </div>
        <div className="input-field">
          <input
            name="lastName"
            value={lastName}
            onChange={this.handleChange}
            type="text"
            placeholder="Last Name"
            className="form-control"
          />
        </div>
        <div className="input-field">
          <input
            name="username"
            value={username}
            onChange={this.handleChange}
            type="text"
            placeholder="Username"
            className="form-control"
          />
        </div>
        <div className="input-field">
          <input name="email" value={email} onChange={this.handleChange} type="email" placeholder="Email" className="form-control"/>
          </div>

          <div className="input-field">
          <input required name="password" value={password} onChange={this.handleChange} type="password" placeholder="Password" className="form-control"/>
          </div>

          <div className="input-field">
          <input required name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={this.handleChange}
                  type="password"
                  placeholder="Retype Password"
                  className="form-control"/>
                </div>
          <button type="submit" disabled={!isValid} className="btn btn-lg btn-primary btn-block btn-white">
          Sign Up
          </button>
        </form>
        </div>
      </div>
      </Fragment>
  )
  }
}

const SignUpURL = () => (
  <p align="center">
  Click here to signup! <Link to={'/signup'}>Sign Up </Link>
  </p>
);

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpURL };
