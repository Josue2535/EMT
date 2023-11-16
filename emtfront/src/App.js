// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined } from '@ant-design/icons'; // Iconos para la historia clínica y el rol

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

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Ajustar el ancho de la barra lateral */}
        <Sider width={200} theme="dark">
          {/* Imagen del usuario en la parte superior */}
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Avatar size={48} src={usuario.imagen} />
            <div style={{ marginTop: '8px', color: 'white' }}>{usuario.nombre}</div>
          </div>
          {/* Sección de Historia Clínica */}
          <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<FileTextOutlined />}>
              <span>Historia Clínica</span>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                {historiaClinica.patientId} - {historiaClinica.created}
              </div>
            </Menu.Item>
            {/* Sección de Adjuntos */}
            <Menu.SubMenu key="2" icon={<FileTextOutlined />} title="Adjuntos">
              {historiaClinica.attachments.map((attachment) => (
                <Menu.Item key={attachment.id}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {attachment.id} - {attachment.created}
                  </div>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
            {/* Sección de Rol */}
            <Menu.SubMenu key="3" icon={<UserOutlined />} title="Rol">
              <Menu.Item key="3.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Rol: {rol.name}
                </div>
              </Menu.Item>
              <Menu.Item key="3.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Campos Válidos: {rol.validFields[0].value.join(', ')}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
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
