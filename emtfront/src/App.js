// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';

import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';

// Importar la imagen del usuario
import userImage from './assets/images/6326055.png';

const { Header, Sider, Content } = Layout;

const App = () => {
  const usuario = {
    nombre: 'Nombre del Usuario',
    // Usar la imagen importada
    imagen: userImage,
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={80} theme="dark">
          {/* Imagen del usuario en la parte superior */}
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Avatar size={48} src={usuario.imagen} />
            <div style={{ marginTop: '8px', color: 'white' }}>{usuario.nombre}</div>
          </div>
          {/* Otras opciones de la barra lateral */}
          <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
            {/* ... */}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            {/* Contenido del encabezado */}
          </Header>
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
