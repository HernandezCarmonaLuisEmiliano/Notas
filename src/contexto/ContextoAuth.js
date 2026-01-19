import { createContext, useState } from "react";
import { supabase } from "../supabase/supabase";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // ======================
  // INICIAR SESIÓN
  // ======================
  const iniciarSesion = async (correo, password, navigation) => {
    if (!correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("correo", correo.trim())
      .eq("password", password.trim())
      .maybeSingle(); // 👈 IMPORTANTE

    if (error || !data) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    setUsuario(data);

    navigation.replace(
      data.rol === "maestro" ? "Maestro" : "Alumno"
    );
  };

  // ======================
  // REGISTRO
  // ======================
  const registro = async (nombre, correo, password, rol) => {
    if (!nombre || !correo || !password || !rol) {
      throw new Error("Completa todos los campos");
    }

    // 🔎 Verificar si el correo ya existe
    const { data: existente } = await supabase
      .from("usuario")
      .select("id")
      .eq("correo", correo.trim())
      .maybeSingle();

    if (existente) {
      throw new Error("Ese correo ya está registrado");
    }

    // 📝 Registrar usuario
    const { error } = await supabase.from("usuario").insert([
      {
        nombre: nombre.trim(),
        correo: correo.trim(),
        password: password.trim(),
        rol,
      },
    ]);

    if (error) {
      throw new Error("Error al registrar usuario");
    }
  };

  // ======================
  // CERRAR SESIÓN
  // ======================
  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <ContextoAuth.Provider
      value={{
        usuario,
        iniciarSesion,
        registro,
        cerrarSesion,
      }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}
