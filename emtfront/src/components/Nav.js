import React, { useState, useEffect } from "react";
import { Menu, Button, Drawer, Typography } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { Navigate, redirect } from "react-router-dom";
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
        // Obtén los roles del usuario desde keycloak
        const keycloakRoles = keycloak.tokenParsed?.roles || [];
        
        // Para cada rol, realiza la petición para obtener la información
        const rolesPromises = keycloakRoles.map(async roleName => {
          const roleInfo = await fetchRoleInfo(roleName, keycloak.token);
          return roleInfo;
        });
    
        // Espera a que todas las promesas se resuelvan
        const roles = await Promise.all(rolesPromises);
    
        // Filtra roles nulos (peticiones que fallaron)
        const validRoles = roles.filter(role => role !== null);
    
        // Combina los validFields de todos los roles en una sola lista
        const allValidFields = validRoles.flatMap(role => role.validFields);
    
        // Crea los elementos del menú
        const items = createMenuItems(allValidFields);
        setMenuItems(items);
      } catch (error) {
        console.error('Error al obtener roles y construir el menú:', error);
      }
    };
    
    // Función para obtener la información de un rol
    const fetchRoleInfo = async (roleName, token) => {
      try {
        const response = await fetch(
          `https://localhost:7208/api/Role/${roleName}`,
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
    // Genera elementos del menú según los validFields del rol
    return validFields.map((field) => {
      const routeKey = field.name.toLowerCase(); // Usa el nombre como identificador de la ruta
      const routeLabel = field.name; // Usa el nombre como etiqueta de la ruta

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
    // Actualiza el estado de redirección al hacer clic en el elemento del menú
    navigate(`/${route}`);
    setDrawerVisible(false); // Cierra el Drawer después de la redirección
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {keycloak.authenticated && (
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer} />
      )}
      <Drawer
        title="EMT"
        placement="left"
        closable={true}
        onClose={handleDrawerClose}
        visible={drawerVisible}
      >
        <Menu mode="vertical">
        {keycloak.authenticated && menuItems.length > 0 && menuItems.map(item => (
            <Menu.Item key={item.key} onClick={() => handleMenuClick(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
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
