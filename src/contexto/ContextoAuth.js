import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const data = await AsyncStorage.getItem("usuarios");
    if (data) {
      setUsuariosRegistrados(JSON.parse(data));
    }
  };

  // REGISTRO
  const registrar = async (nombre, correo, password, rol) => {
    if (!nombre || !correo || !password) {
      throw new Error("Completa todos los campos");
    }

    const existe = usuariosRegistrados.some(
      (u) => u.correo === correo
    );

    if (existe) {
      throw new Error("El correo ya está registrado");
    }

    const nuevoUsuario = { nombre, correo, password, rol };
    const nuevosUsuarios = [...usuariosRegistrados, nuevoUsuario];

    await AsyncStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    setUsuariosRegistrados(nuevosUsuarios);
  };

  // LOGIN
  const iniciarSesion = async (correo, password) => {
    if (!correo || !password) {
      throw new Error("Completa todos los campos");
    }

    if (usuariosRegistrados.length === 0) {
      throw new Error("No hay usuarios registrados");
    }

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!usuarioEncontrado) {
      throw new Error("Correo o contraseña incorrectos");
    }

    setUsuario(usuarioEncontrado);
    return usuarioEncontrado;
  };

  const cerrarSesion = async () => {
    setUsuario(null);
  };

  return (
    <ContextoAuth.Provider
      value={{
        usuario,
        registrar,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}
