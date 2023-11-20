import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './Keycloak.js'; // Asegúrate de tener la configuración de Keycloak aquí
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak}>
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
