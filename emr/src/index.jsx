import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from './routes/routes'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './util/keycloak'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <Routes />
  </ReactKeycloakProvider>
)