import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpURL } from '../SignUp';
import { withFirebase } from '../Firebase';


const initState = {
  email: '',
  password: '',
  error: null,
  loginSuccessful: false
};

const SignInPage = () => (
  <div>
    <SignInForm />
    <SignUpURL />
  </div>
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }

  componentDidMount(){
    if (localStorage.getItem('uid')) {
      return this.props.history.push('/admin/dashboard');
    }
  }

  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...initState });
        this.props.history.push('/admin/dashboard');
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleGoogleLogin = () => {
    const _this = this;
    this.props.firebase.doSignInWithGoogle().then(res => {
      console.log('google sign ssuccess', res);
      localStorage.setItem('uid', res.user.uid);
      localStorage.setItem('token', res.credential.idToken);
      //this.props.history.push('/admin/dashboard');
      return _this.setState({loginSuccessful: true});
    }).catch(err => console.log('google errr login', err))
  }

  render() {
    const { email, password, error, loginSuccessful } = this.state;

    const isInvalid = password === '' || email === '';

    if(loginSuccessful){
      return window.location.href = '/admin/dashboard';
    }

    return (
      <div className="container">
      <form onSubmit={this.onSubmit} className="form-signin" role="form">
      <h2 className="form-signin-heading">Heart Smart Sign In</h2>
      <div className="input-field">
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email Address"
          className="form-control"
        />
        </div>
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
          className="form-control"
        />
        <button type="submit" className="btn btn-lg btn-primary btn-block orange">
          Sign In
        </button>

        <button onClick={this.handleGoogleLogin} className="btn btn-lg btn-primary btn-block btn-danger">
          Login With Google
        </button>
        {error && <p>{error.message}</p>}
      </form>

      <div className="container">

      </div>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
