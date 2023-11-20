import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd'; // Asegúrate de importar el componente de botón de antd
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  // Verificar si Keycloak está inicializado
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      console.log('User is authenticated');
      // Aquí puedes realizar acciones específicas para usuarios autenticados
    } else {
      console.log('User is not authenticated');
    }
  }, [initialized, keycloak.authenticated]);

  const handleLoginClick = () => {
    keycloak.login(); // Redirige al inicio de sesión de Keycloak
  };

  return (
    <div>
      <h1 className="text-green-800 text-4xl">Welcome to the Homepage</h1>
      {!keycloak.authenticated && (
        <Button type="primary" onClick={handleLoginClick}>
          Login
        </Button>
      )}
    </div>
  );
};

export default Home;
