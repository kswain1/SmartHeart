import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const authToken = localStorage.getItem('token');
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
      console.log('locccccffff', props)
      // console.log(this.props.firebase.currentUser())
      return  (authToken != undefined || authToken != null)
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }} />
    }} />
)

export default ProtectedRoute;
