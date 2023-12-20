import React from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';

const FabSubmitButton = ({color}) => (
    <Fab type='submit' variant="contained" size='medium' color={color} sx={{ color: 'white', mb: 2 }}>
        <SaveIcon />
    </Fab>
);

export default FabSubmitButton;
