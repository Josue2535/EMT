import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const Login = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
};

export default Login;
