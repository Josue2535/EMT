import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined, BookOutlined, UserAddOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons';
import keycloak from "./Keycloak"
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import HistoriaClinica from './views/HistoriaClinica';
import Rol from './views/Rol';
import FormatoHistoriaClinica from './views/FormatoHistoriaClinica';
import Paciente from './views/Paciente';
import InformacionPersonal from './views/InformacionPersonal';
import Usuario from './views/Usuario';
import FormatoInformacionPersonal from './views/FormatoInformacionPersonal';
import FormatoPaciente from './views/FormatoPaciente';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import userImage from './assets/images/6326055.png';
import PrivateRoute from './PrivateRoute';
const { Header, Sider, Content } = Layout;

const App = () => {
  const usuario = {
    nombre: 'Nombre del Usuario',
    imagen: userImage,
  };

  const historiaClinica = {
    id: "string",
    created: "2023-11-16T18:22:43.612Z",
    patientId: "string",
    attachments: [
      {
        id: "string",
        created: "2023-11-16T18:22:43.612Z",
        fields: [
          {
            name: "string",
            value: "string"
          }
        ]
      }
    ]
  };

  const rol = {
    name: "admin",
    validFields: [
      {
        name: "ClinicHistoryFormat",
        value: [
          "post",
          "put",
          "delet",
          "get"
        ]
      }
    ]
  };

  const historiaClinicaFormato = {
    id: "string",
    creationDate: "2023-11-16T18:24:33.725Z",
    validFields: [
      {
        fieldType: "string",
        fieldName: "string",
        isOptional: true,
        fieldOptions: [
          "string"
        ]
      }
    ],
    description: "string"
  };

  const paciente = {
    id: "string",
    created: "2023-11-16T18:25:02.799Z",
    role: "string",
    fieldsList: [
      {
        name: "string",
        value: "string"
      }
    ],
    personalInformationId: "string",
    isEnabled: true
  };

  const informacionPersonal = {
    id: "string",
    created: "2023-11-16T18:25:52.345Z",
    fieldList: [
      {
        name: "string",
        value: "string"
      }
    ]
  };

  const usuarioInfo = {
    id: "string",
    created: "2023-11-16T18:27:26.287Z",
    userName: "string",
    personalInformationId: "string",
    isEnabled: true
  };

  
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    // Lógica de autenticación aquí
    // Setea el estado para indicar que el usuario está autenticado
    setAuthenticated(true);
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión aquí
    // Setea el estado para indicar que el usuario no está autenticado
    setAuthenticated(false);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = keycloak.authenticated;
      setAuthenticated(authenticated);
    };

    checkAuthentication();
  }, []);

  

  return (
    <ReactKeycloakProvider authClient={keycloak}>
       <Router>
      
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={200} theme="dark">
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Avatar size={48} src={usuario.imagen} />
            <div style={{ marginTop: '8px', color: 'white' }}>{usuario.nombre}</div>
          </div>
          <menu
              usuario={usuario}
              historiaClinica={historiaClinica}
              rol={rol}
              historiaClinicaFormato={historiaClinicaFormato}
              paciente={paciente}
              informacionPersonal={informacionPersonal}
              usuarioInfo={usuarioInfo}
            />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <div style={{ textAlign: 'right', marginRight: '16px' }}>
                <Avatar size={48} src={usuario.imagen} />
                <span style={{ marginLeft: '8px' }}>{usuario.nombre}</span>
              </div>
            </Header>
            <Content style={{ margin: '16px' }}>
              <Routes>
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                <Route path="/historiaclinica" element={<PrivateRoute><HistoriaClinica /></PrivateRoute>} />
                <Route path="/rol" element={<Rol />} />
                <Route path="/formatohistoriaclinica" element={<PrivateRoute><FormatoHistoriaClinica /></PrivateRoute>} />
                <Route path="/formatoInformacionPersonal" element={<PrivateRoute><FormatoInformacionPersonal /></PrivateRoute>} />
                <Route path="/formatoPaciente" element={<PrivateRoute><FormatoPaciente /></PrivateRoute>} />
                <Route path="/paciente" element={<PrivateRoute><Paciente /></PrivateRoute>} />
                <Route path="/informacionpersonal" element={<PrivateRoute><InformacionPersonal /></PrivateRoute>} />
                <Route path="/usuario" element={<PrivateRoute><Usuario /></PrivateRoute>} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      
        <Routes>
          <Route path="/login" element={<Login  />} />
        </Routes>
      
    </Router>
    </ReactKeycloakProvider>
  );
  
};

export default App;
