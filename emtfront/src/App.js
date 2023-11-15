// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';


const { Header, Sider, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Resto del código de la barra lateral y el encabezado */}
        <Sider width={80} theme="dark">
          <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
            {/* Otras opciones de la barra lateral */}
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
