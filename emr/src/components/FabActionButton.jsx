import React from 'react';
import Fab from '@mui/material/Fab';

const FabActionButton = ({color, handleClick, icon, disabled }) => (
    <Fab onClick={handleClick} variant="contained" size='medium' color={color} sx={{ zIndex: 1 ,color: 'white', mb: 2 }} disabled={disabled}    >
        {icon}
    </Fab>
);

export default FabActionButton;
