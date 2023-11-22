import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getUsers } from '../api'; // Ajusta la ruta según la ubicación real de tu archivo api.js
import '../assets/styles/Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mostrar SweetAlert2 de carga
        Swal.fire({
          title: 'Cargando...',
          allowOutsideClick: false,
          showConfirmButton: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });

        const users = await getUsers();
        console.log('Users:', users);

        // Cerrar SweetAlert2 cuando la carga sea exitosa
        Swal.close();
        setLoading(false);

        // Informar sobre el éxito
        Swal.fire({
          icon: 'success',
          title: 'Carga Exitosa',
          text: 'Los usuarios se cargaron correctamente.',
        });
      } catch (error) {
        console.error('Error fetching users:', error.message);

        // Cerrar SweetAlert2 en caso de error
        Swal.close();
        setLoading(false);

        // Informar sobre el error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cargar los usuarios.',
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">¡Bienvenido a la Página de Inicio!</h1>
      {loading ? (
        <p className="home-loading">Cargando...</p>
      ) : (
        <p className="home-success">¡La carga se completó exitosamente!</p>
      )}
    </div>
  );
};

export default Home;
