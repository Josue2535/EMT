import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import Logout from './components/Logout';

const App = ({ keycloak }) => {
  return (
    <Router>
      <div>
        <h1>Aplicación React con Keycloak</h1>
        <Routes>
          <Route path="/login" element={<Login keycloak={keycloak} />} />
          <Route path="/logout" element={<Logout keycloak={keycloak} />} />
          {/* Other protected routes */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
