import React, { useState, useEffect } from "react";
import { Menu, Button, Drawer, Typography } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Nav = () => {
  const { keycloak } = useKeycloak();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRolesAndRenderMenu = async () => {
      try {
        const keycloakRoles = keycloak.tokenParsed.realm_access.roles || [];
        const rolesPromises = keycloakRoles.map(async roleName => {
          const roleInfo = await fetchRoleInfo(roleName, keycloak.token);
          return roleInfo;
        });
    
        const roles = await Promise.all(rolesPromises);
        const validRoles = roles.filter(role => role !== null);
        const allValidFields = validRoles.flatMap(role => role.validFields);
    
        const items = createMenuItems(allValidFields);
        setMenuItems(items);
      } catch (error) {
        console.error('Error al obtener roles y construir el menú:', error);
      }
    };
    
    const fetchRoleInfo = async (roleName, token) => {
      try {
        const response = await fetch(
          `https://localhost:7208/api/Role/ByName/${roleName}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error al obtener información del rol ${roleName}: ${response.statusText}`
          );
        }

        const roleInfo = await response.json();
        return roleInfo;
      } catch (error) {
        console.error("Error al obtener información del rol:", error);
        return null;
      }
    };

    if (keycloak.authenticated) {
      fetchRolesAndRenderMenu();
    }
  }, [keycloak.authenticated]);

  const createMenuItems = (validFields) => {
    return validFields.map((field) => {
      const routeKey = field.name.toLowerCase();
      const routeLabel = field.name;

      return {
        key: routeKey,
        label: routeLabel,
      };
    });
  };

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

  const handleMenuClick = (route) => {
    navigate(`/${route}`);
    setDrawerVisible(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", backgroundColor: '#CA5724', padding: '8px' }}>
      {keycloak.authenticated && (
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer}  />
      )}
      <Drawer
        title="EMT"
        placement="left"
        closable={true}
        onClose={handleDrawerClose}
        visible={drawerVisible}
      >
        <Menu mode="vertical" color="white">
        {keycloak.authenticated && menuItems.length > 0 && menuItems.map(item => (
            <Menu.Item key={item.key} onClick={() => handleMenuClick(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
      <Title level={4} style={{ marginBottom: 0, color: 'white' }}>
          Emergency Medical Team
        </Title>
      </div>

      <div style={{ marginRight: '20px', marginLeft: '20px' }}>
        {keycloak.authenticated ? (
          <Button type="link"  icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }}>
            Logout
          </Button>
        ) : (
          <Button type="primary"  onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
