// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined, BookOutlined, UserAddOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons'; // Iconos para la historia clínica, el rol, el formato de historia clínica, el paciente, la información personal y el usuario

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
            {/* Sección de Formato de Historia Clínica */}
            <Menu.SubMenu key="4" icon={<BookOutlined />} title="Formato de Historia Clínica">
              <Menu.Item key="4.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  ID: {historiaClinicaFormato.id}
                </div>
              </Menu.Item>
              <Menu.Item key="4.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {historiaClinicaFormato.creationDate}
                </div>
              </Menu.Item>
              {/* Aquí puedes agregar más detalles del formato de historia clínica según tus necesidades */}
            </Menu.SubMenu>
            {/* Sección de Paciente */}
            <Menu.SubMenu key="5" icon={<UserAddOutlined />} title="Paciente">
              <Menu.Item key="5.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  ID del Paciente: {paciente.id}
                </div>
              </Menu.Item>
              <Menu.Item key="5.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {paciente.created}
                </div>
              </Menu.Item>
              {/* Agregar más detalles del paciente según tus necesidades */}
            </Menu.SubMenu>
            {/* Sección de Información Personal */}
            <Menu.SubMenu key="6" icon={<SolutionOutlined />} title="Información Personal">
              <Menu.Item key="6.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  ID: {informacionPersonal.id}
                </div>
              </Menu.Item>
              <Menu.Item key="6.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {informacionPersonal.created}
                </div>
              </Menu.Item>
              {/* Agregar más detalles de la información personal según tus necesidades */}
            </Menu.SubMenu>
            {/* Sección de Usuario */}
            <Menu.SubMenu key="7" icon={<UserSwitchOutlined />} title="Usuario">
              <Menu.Item key="7.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  ID: {usuarioInfo.id}
                </div>
              </Menu.Item>
              <Menu.Item key="7.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Nombre de Usuario: {usuarioInfo.userName}
                </div>
              </Menu.Item>
              {/* Agregar más detalles del usuario según tus necesidades */}
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
