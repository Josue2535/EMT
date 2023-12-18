import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Assignment, Home } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useKeycloak } from "@react-keycloak/web"
import { useState } from "react"
import { useEffect } from "react"

const translate = {
    "clinicalhistoryformat": "Formato de Historia Clínica",
    "clinicalhistory": "Historia Clínica",
    "patientformat": "Formato de Paciente",
    "patient": "Paciente",
    "role": "Rol",
}

export default function Menu({ mobile, toggleDrawer }) {

    const { keycloak } = useKeycloak();
    const [menuItems, setMenuItems] = useState([]);

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

    const closeMenu = () => {
        if (mobile) {
            toggleDrawer()
        }
    }

    return (
        <>
            <ListItemButton component={Link} to="/" onClick={closeMenu}>
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
            </ListItemButton>
            {keycloak.authenticated && menuItems.length > 0 && menuItems.map(item => (
                item.label !== "formats" &&
                < ListItemButton key={item.key} component={Link} to={`/${item.key}`} onClick={closeMenu}>
                    <ListItemIcon>
                        <Assignment />
                    </ListItemIcon>
                    <ListItemText primary={translate[item.key]} />
                </ListItemButton >
            ))}
        </>
    )
}