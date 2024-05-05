import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
  if (!user ) {
    return <Navigate to="/login" />;  
  }

  if(user?.role != 'admin') {
    return <Navigate to="/slots" />;  
  }

  return children;
};

export default AdminRoute;
