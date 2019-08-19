import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const authToken = localStorage.getItem('token');
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        (authToken != undefined || authToken != null)
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }} />
    )} />
)

export default ProtectedRoute;
