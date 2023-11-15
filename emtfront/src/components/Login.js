import React from 'react';
import { Button } from 'antd';

const Login = ({ keycloak }) => {
  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div>
      <h2>Login</h2>
      <Button onClick={handleLogin}>Iniciar sesión con Keycloak</Button>
    </div>
  );
};

export default Login;
