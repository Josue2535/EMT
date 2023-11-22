import React, { useState } from 'react';
import { Menu, Button, Drawer, Typography } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import {
  MenuOutlined,
  UserOutlined,
  BookOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Nav = () => {
  const { keycloak } = useKeycloak();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {keycloak.authenticated && (
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer} />
      )}
      <Drawer title="EMT" placement="left" closable={true} onClose={handleDrawerClose} visible={drawerVisible}>
        <Menu mode="vertical">
          {keycloak.authenticated && (
            <>
              <Menu.Item key="options" icon={<UserSwitchOutlined />}>
                Opciones
              </Menu.Item>
              <Menu.Item key="option1" icon={<UserOutlined />}>
                Opción 1
              </Menu.Item>
              <Menu.Item key="option2" icon={<BookOutlined />}>
                Opción 2
              </Menu.Item>
            </>
          )}
        </Menu>
      </Drawer>

      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          EMT APP
        </Title>
      </div>

      <div>
        {keycloak.authenticated ? (
          <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
