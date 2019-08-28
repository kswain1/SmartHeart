import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import { withFirebase } from '../Firebase'

const SignUpPage = () => (
  <div><h1>Sign Up</h1>
  <SignUpForm /></div>
);

const initState = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
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
    const {username, password, email} = this.state;
    this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(authUser => {
      console.log('auth user', authUser);
      //this.setState({...initState});
      //this.props.history.push('/');
    }).catch((err) => {
      console.log('auth errr', err);
      //TODO
    });
  }

  render() {
    const {username, email, password, passwordConfirm, error} = this.state;
    const isValid = email && username && password === passwordConfirm;

    return (
      <form onSubmit={this.handleFormSubmit}>
        <input required name="username" value={username} onChange={this.handleChange} type="text" placeholder="Username" />
        <input required name="email" value={email} onChange={this.handleChange} type="text" placeholder="Email" />
        <input required name="password" value={password} onChange={this.handleChange} type="password" placeholder="Password" />
        <input required name="passwordConfirm" value={passwordConfirm} onChange={this.handleChange} type="password" placeholder="Retype Password" />
        <button type="submit" disabled={!isValid}>Sign Up</button>
      </form>
  )
  }
}

const SignUpURL = () => (
  <p align="center">
  Click here to signup! <Link to={'/signup1'}>Sign Up </Link>
  </p>
);

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpURL };
