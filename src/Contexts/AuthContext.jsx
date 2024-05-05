import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(user?.jti || null);

  const login = (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newUser.jti);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role == 'admin'
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
