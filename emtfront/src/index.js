import React from 'react';
import App from './App';

import ReactDOM from 'react-dom';
import './index.css';
import Keycloak from 'keycloak-js';

// Muestra un mensaje de carga mientras se inicializa Keycloak
ReactDOM.render(
  <div>
    <h1>Cargando...</h1>
  </div>,
  document.getElementById('root')
);

const keycloak = Keycloak({
  realm: 'TU_REALM',
  url: 'URL_DEL_SERVIDOR_DE_KEYCLOAK',
  clientId: 'TU_CLIENT_ID',
});

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
  if (authenticated) {
    console.log('Usuario autenticado');
    renderApp();
  } else {
    console.log('Autenticación fallida');
  }
});

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App keycloak={keycloak} />
    </React.StrictMode>,
    document.getElementById('root')
  );
};
