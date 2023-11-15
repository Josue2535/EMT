import React from 'react';
import { Button } from 'antd';

const Logout = ({ keycloak }) => {
  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <div>
      <h2>Logout</h2>
      <Button type="primary" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
};

export default Logout;
