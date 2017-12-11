import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './graph.jsx';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'

class LoginSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPassword: '',
      signupEmail: '',
      signupName: '',
      signupPassword: '',
      signupImageUrl: ''
    }
  }

  onInputChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  onSignupSubmit(e) {
    e.preventDefault();
  }

  onLoginSubmit(e) {
    e.preventDefault();
  }

  loginForm() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label for="inputEmail">Email Address</label>
            <input type="email" className="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="Enter email"/>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email to anyone else.</small>
          </div>
          <div className="form-group">
            <label for="inputPassword">Password</label>
            <input type="password" className="form-control" id="loginPassword" placeholder="Password"/>
          </div>
        </form>
      </div>
    )
  }

  signupForm() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label for="inputName">Name</label>
            <input type="text" className="form-control" id="signupName" placeholder="Name"/>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="inputEmail">Email</label>
              <input type="email" className="form-control" id="signupEmail" placeholder="Email"/>
              <small id="emailHelp" className="form-text text-muted">This email account will be used for logging in.</small>
            </div>
            <div className="form-group col-md-6">
              <label for="inputPassword">Password</label>
              <input type="password" className="form-control" id="signupPassword" placeholder="Password"/>
            </div>
            <div className="form-group">
              <label for="inputName">Profile Image</label>
              <input type="text" className="form-control" id="signupImageUrl" placeholder="Image Url"/>
            </div>
          </div>
        </form>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.loginForm()}
        {this.signupForm()}
      </div>
    )
  }
}

export default LoginSignup;