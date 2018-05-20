import React from 'react'
import messages from 'lib/text'
import CezerinClient from 'cezerin-client';
import settings from 'lib/settings';
import * as auth from 'lib/auth'

import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField';

import { Card, CardText } from 'material-ui/Card';
import {Link} from "react-router-dom";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem('dashboard_email') || '',
      isFetching: false,
      isAuthorized: false,
      emailIsSent: false,
      error: null,



      errors:{ email: 'Invalid' },
      user:{ email: 'jane@doe.com', name: 'Jane Doe' }
    };
  }

  handleChange = (event) => {
    this.setState({
      email: event.target.value
    });
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    this.setState({
      isFetching: true,
      isAuthorized: false,
      emailIsSent: false,
      error: null
    });

    debugger;
    CezerinClient.authorize(settings.apiBaseUrl, this.state.email)
      .then(authorizeResponse => {
        this.setState({
          isFetching: false,
          isAuthorized: false,
          emailIsSent: authorizeResponse.json.sent,
          error: authorizeResponse.json.error
        });
      })
      .catch(error => {
        this.setState({
          isFetching: false,
          isAuthorized: false,
          emailIsSent: false,
          error: error
        });
      });
  }

  onSubmit() {
    console.log('submitted')
  }

  onChange = (e) => console.log('changed')


  componentWillMount() {
    debugger;
    auth.checkTokenFromUrl();
  }
  componentDidMount() {}

  render() {
    const {
      email,
      isFetching,
    	isAuthorized,
    	emailIsSent,
    	error
    } = this.state;

    let response = null;
    if(isFetching){
      response = <div className="loginSuccessResponse">{messages.messages_loading}</div>;
    } else if (emailIsSent) {
      response = <div className="loginSuccessResponse">{messages.loginLinkSent}</div>;
    } else if(emailIsSent === false && error) {
      response = <div className="loginErrorResponse">{error}</div>;
    }

    return (

      <div className="row col-full-height center-xs middle-xs">
        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
          <Card>
            <form action="/" onSubmit={this.onSubmit}>
              <h2 className="card-heading">Sign Up</h2>

              {errors.summary && <p className="error-message">{errors.summary}</p>}

              <div className="field-line">
                <TextField
                  floatingLabelText="Name"
                  name="name"
                  errorText={errors.name}
                  onChange={this.onChange}
                  value={user.name}
                />
              </div>

              <div className="field-line">
                <TextField
                  floatingLabelText="Email"
                  name="email"
                  errorText={errors.email}
                  onChange={this.onChange}
                  value={user.email}
                />
              </div>

              <div className="field-line">
                <TextField
                  floatingLabelText="Password"
                  type="password"
                  name="password"
                  onChange={this.onChange}
                  errorText={errors.password}
                  value={user.password}
                />

              </div>

              <div className="button-line">
                <RaisedButton type="submit" label="Create New Account" primary />
              </div>

              <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}
