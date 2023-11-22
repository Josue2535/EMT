import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Menu, Button, Drawer, Typography } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Nav = () => {
  const { keycloak } = useKeycloak();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        if (keycloak.authenticated) {
          const roles = keycloak.realmAccess.roles;
          const userRoutes = [];
    
          if (roles && roles.length > 0) {
            for (const role of roles) {
              const response = await fetch(`https://localhost:7208/api/Role/${role}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${keycloak.token}`,
                  'Accept': 'application/json',
                },
              });
    
              if (response.ok) {
                const data = await response.json();
    
                // Console.log para depurar
                console.log(`Data for role ${role}:`, data);
    
                // Obtener todas las rutas para el rol actual
                const routesForRole = data.validFields.map(field => field.name);
                userRoutes.push(...routesForRole);
              } else {
                console.error(`Failed to fetch data for role ${role}`);
              }
            }
    
            // Console.log para depurar
            console.log('User routes:', userRoutes);
    
            setAllRoutes(userRoutes);
          } else {
            console.error('User has no roles');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchRoutes();
  }, [keycloak]);

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

  const userName = keycloak.authenticated ? keycloak.idTokenParsed.name : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {keycloak.authenticated && (
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer} />
      )}
      <Drawer title="EMT" placement="left" closable={true} onClose={handleDrawerClose} visible={drawerVisible}>
        <Menu mode="vertical">
          {keycloak.authenticated && allRoutes.length > 0 && (
            <>
              {allRoutes.map((route, index) => (
                <Menu.Item key={index} icon={<UserOutlined />}>
                  <Link to={`/${route}`}>{route}</Link>
                </Menu.Item>
              ))}
            </>
          )}
        </Menu>
      </Drawer>

      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          {userName ? `Hola, ${userName}` : 'EMT APP'}
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
