import React from 'react';
import { Button } from 'antd';

const Logout = ({ keycloak }) => {
  

  return (
    <div>
      <h2>Logout</h2>
      <Button type="primary" onClick={keycloak.logout()}>
        Cerrar sesión
      </Button>
    </div>
  );
};

export default Logout;
