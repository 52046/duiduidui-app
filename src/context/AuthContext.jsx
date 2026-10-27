import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginConGoogle = () => {
    setUser({ nombre: "Estudiante", email: "correo@gmail.com" });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginConGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};