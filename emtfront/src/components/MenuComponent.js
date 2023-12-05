// MenuComponent.js
import React from 'react';
import { Menu, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined, BookOutlined, UserAddOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MenuComponent = ({ usuario, historiaClinica, rol, historiaClinicaFormato, paciente, informacionPersonal, usuarioInfo }) => {
  return (
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
  );
};

export default MenuComponent;
