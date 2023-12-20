import React from 'react';
import Fab from '@mui/material/Fab';

const FabActionButton = ({color, handleClick, icon}) => (
    <Fab onClick={handleClick} variant="contained" size='medium' color={color} sx={{ color: 'white', mb: 2 }}>
        {icon}
    </Fab>
);

export default FabActionButton;
