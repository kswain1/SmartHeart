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
import React from "react";
import ReactDOM from "react-dom";


import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from './protectedroutes';

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import AdminLayout from "layouts/Admin.jsx";
import GuestLayout from "layouts/Guest.jsx";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Firebase, {FirebaseContext} from './components/Firebase';

ReactDOM.render(
  <BrowserRouter>
  <FirebaseContext.Provider value={new Firebase()}>
    <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <ProtectedRoute path="/admin" component={props => <AdminLayout {...props} />} />
    </Switch>
    </FirebaseContext.Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
