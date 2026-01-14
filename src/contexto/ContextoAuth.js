import { createContext, useState } from "react";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const iniciarSesion = (correo, rol) => {
    setUsuario({ correo, rol });
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <ContextoAuth.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}
