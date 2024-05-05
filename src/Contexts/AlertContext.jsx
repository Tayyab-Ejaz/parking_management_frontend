import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    message: '',
    severity: 'info', // Severity can be "success", "error", "info", "warning"
    open: false,
  });

  const showAlert = (message, severity = 'info') => {
    setAlert({
      message,
      severity,
      open: true,
    });
  };

  const closeAlert = () => {
    setAlert((alert) => ({
      ...alert,
      open: false,
    }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
