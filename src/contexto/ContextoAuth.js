import { createContext, useState } from "react";

export const ContextoAuth = createContext();

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const iniciarSesion = (email, rol) => {
    setUsuario({ email, rol });
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <ContextoAuth.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  );
};
