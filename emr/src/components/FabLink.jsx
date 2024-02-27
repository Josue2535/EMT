import React from 'react';
import Fab from '@mui/material/Fab';
import { Link } from 'react-router-dom';

const FabLink = ({ to, icon, color, }) => (
  <Fab component={Link} to={to} size='medium' color={color} sx={{color:'white', mb:2}}>
    {icon}
  </Fab>
);

export default FabLink;