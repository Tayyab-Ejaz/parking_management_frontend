import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import { useAlert } from '../Contexts/AlertContext';

const GlobalAlert = () => {
  const { alert, closeAlert } = useAlert();

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={6000} 
      onClose={closeAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
    >
      <MuiAlert onClose={closeAlert} severity={alert.severity} sx={{ width: '100%' }}>
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default GlobalAlert;
