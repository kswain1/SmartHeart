import React, {Component} from 'react'

class SignIn extends Component {
  state = {

  }

  handleChange = (e) => {
    console.log("we taking care of change to state of form");
  }

  handleSubmit = (e) => {
    console.log("we are handling submit");
  }
  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlForm="email">Email</label>
            <input type="email" id="email" onChange={this.handleChange}/>
          </div>
          <div className="input-field">
            <label htmlForm="password">Password</label>
            <input type="password" id="password" onChange={this.handleChange}/>
          </div>
          <div className="input-field">
            <button>Login</button>
          </div>
        </form>
      </div>
    )
  }
}

export default SignIn
