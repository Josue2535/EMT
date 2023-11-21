import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import keycloak from '../Keycloak'; 
import loginImage from '../assets/images/6326055.png';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-width: 300px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 16px;
  color: #333;
`;

const Image = styled.img`
  border-radius: 50%;
  margin-bottom: 16px;
`;

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await keycloak.init(); // Inicializa Keycloak
      await keycloak.login(); // Inicia sesión con Keycloak

      // Si la autenticación es exitosa, redirige al dashboard
      if (keycloak.authenticated) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Maneja errores de inicio de sesión
      console.error('Error al iniciar sesión con Keycloak:', error);
    }
  };
  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image src={loginImage} alt="Login" width={120} height={120} />
        <Title>Login</Title>
        <Button type="primary" onClick={handleLogin}>
          Iniciar sesión con Keycloak
        </Button>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
