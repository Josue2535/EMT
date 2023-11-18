import React from 'react';
import { Link, Route } from 'react-router-dom';
import keycloak from './Keycloak';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      keycloak.authenticated ? (
        <Component {...props} />
      ) : (
        <Link to="/login" />
      )
    }
  />
);

export default PrivateRoute;
