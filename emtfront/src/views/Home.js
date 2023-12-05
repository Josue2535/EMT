import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getUsers } from '../api'; // Ajusta la ruta según la ubicación real de tu archivo api.js
import '../assets/styles/Home.css';

import imagen1 from '../assets/images/Imghsr1.png'; // Reemplaza con la ruta correcta
import imagen2 from '../assets/images/Imghsr2.png';
import { Carousel } from 'antd';




const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
     
    };

    fetchData();
  }, []);

  const containerStyle = {
    //backgroundImage: `url(${loginImage})`,
    //backgroundColor: '#A2195B',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',    
  };

  const titleStyle = {
    //color: '#ffffff',
    color: '#A2195B',
    fontSize: '3rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };

  const carouselContainerStyle = {
    width: '80%',
    marginTop: '20px',
  };

  const imageStyle = {
    width: '100%',
    height: '50%',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Fundación Italocolombiana del Monte Tabor</h1>

      <div style={carouselContainerStyle}>
        <Carousel autoplay autoplaySpeed={3000}>
        
          {/* Agrega tus imágenes como elementos <div> dentro del carrusel */}
          <div>
          <img src={imagen1} alt="Imagen 1" style={imageStyle} />
          </div>
          <div>
          <img src={imagen2} alt="Imagen 2" style={imageStyle} />
          </div>
          {/* Agrega más imágenes según sea necesario */}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
