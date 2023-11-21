// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined, BookOutlined, UserAddOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons';

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

import userImage from './assets/images/6326055.png';

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

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} theme="dark">
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Avatar size={48} src={usuario.imagen} />
            <div style={{ marginTop: '8px', color: 'white' }}>{usuario.nombre}</div>
          </div>
          <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<FileTextOutlined />}>
              <Link to="/historiaclinica">Historia Clínica</Link>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                {historiaClinica.patientId} - {historiaClinica.created}
              </div>
            </Menu.Item>
            <Menu.SubMenu key="2" icon={<FileTextOutlined />} title="Adjuntos">
              {historiaClinica.attachments.map((attachment) => (
                <Menu.Item key={attachment.id}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                    <Link to="/historiaclinica/">{attachment.id} - {attachment.created}</Link>
                  </div>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.SubMenu key="3" icon={<UserOutlined />} title="Rol">
              <Menu.Item key="3.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <Link to="/rol">Rol: {rol.name}</Link>
                </div>
              </Menu.Item>
              <Menu.Item key="3.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Campos Válidos: {rol.validFields[0].value.join(', ')}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="4" icon={<BookOutlined />} title="Formato de Historia Clínica">
              <Menu.Item key="4.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <Link to="/formatohistoriaclinica"> ID: {historiaClinicaFormato.id} </Link>
                </div>
              </Menu.Item>
              <Menu.Item key="4.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {historiaClinicaFormato.creationDate}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="5" icon={<UserAddOutlined />} title="Paciente">
              <Menu.Item key="5.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <Link to="/paciente">ID del Paciente: {paciente.id}</Link>
                </div>
              </Menu.Item>
              <Menu.Item key="5.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {paciente.created}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="6" icon={<SolutionOutlined />} title="Información Personal">
              <Menu.Item key="6.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <Link to="/informacionpersonal">ID: {informacionPersonal.id}</Link>
                </div>
              </Menu.Item>
              <Menu.Item key="6.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Fecha de Creación: {informacionPersonal.created}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="6.3" icon={<SolutionOutlined />} title="Formato de Informacion Personal">
              <Link to="/formatoInformacionPersonal">Formato de Información Personal</Link>
              </Menu.SubMenu>
            <Menu.SubMenu key="8" icon={<UserAddOutlined />} title="Formato de Paciente">
              <Link to="/FormatoPaciente"></Link>
            </Menu.SubMenu>
            <Menu.SubMenu key="7" icon={<UserSwitchOutlined />} title="Usuario">
              <Menu.Item key="7.1">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <Link to="/usuario">ID: {usuarioInfo.id}</Link>
                </div>
              </Menu.Item>
              <Menu.Item key="7.2">
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Nombre de Usuario: {usuarioInfo.userName}
                </div>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}></Header>
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/historiaclinica" element={<HistoriaClinica />} />
              <Route path="/rol" element={<Rol />} />
              <Route path="/formatohistoriaclinica" element={<FormatoHistoriaClinica />} />
              <Route path="/formatoInformacionPersonal" element={<FormatoInformacionPersonal />} />
              <Route path="/formatoPaciente" element={<FormatoPaciente />} />
              <Route path="/paciente" element={<Paciente />} />
              <Route path="/informacionpersonal" element={<InformacionPersonal />} />
              <Route path="/usuario" element={<Usuario />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;