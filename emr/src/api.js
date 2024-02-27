// src/api.js
const API_URL = 'https://localhost:7208/api';

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al obtener la lista de usuarios');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al crear el usuario');
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al actualizar el usuario');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al eliminar el usuario');
  }
};


export const getPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacient`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al obtener la lista de pacientes');
    }
  };
  
  export const createPaciente = async (pacienteData) => {
    try {
      const response = await fetch(`${API_URL}/pacient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacienteData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al crear el paciente');
    }
  };
  
  export const updatePaciente = async (pacienteId, pacienteData) => {
    try {
      const response = await fetch(`${API_URL}/pacient/${pacienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacienteData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el paciente');
    }
  };
  
  export const deletePaciente = async (pacienteId) => {
    try {
      const response = await fetch(`${API_URL}/pacient/${pacienteId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al eliminar el paciente');
    }
  };