import { createContext, useState } from "react";
import { supabase } from "../supabase/supabase";
import { Alert } from "react-native";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const correoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const iniciarSesion = async (correo, password, navigation) => {
    if (!correo || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const { data, error } = await supabase
      .from("registro")
      .select(`
        *,
        correo:coreo_id!inner(email),
        contrasena:contrasena_id!inner(contrasena) 
      `)
      .eq("correo.email", correo.trim())
      .eq("contrasena.contrasena", password.trim())
      .maybeSingle();

    if (error || !data) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
      return;
    }

    setUsuario(data);
    navigation.replace(data.rol === "maestro" ? "PantallaMaestro" : "PantallaAlumno");
  };

  const registro = async (nombre, correo, password, rol, grupoId) => {
    if (!nombre?.trim() || !correo?.trim() || !password?.trim() || !rol) {
      throw new Error("Completa todos los campos obligatorios");
    }

    // NORMALIZACIÓN: Forzamos minúsculas para evitar el error 'registro_rol_check'
    const rolLimpio = rol.trim().toLowerCase();

    try {
      // PASO 1: Obtener o crear ID de correo
      let idCorreo;
      const { data: existeCorreo } = await supabase
        .from("correo")
        .select("id")
        .eq("email", correo.trim())
        .maybeSingle();

      if (existeCorreo) {
        idCorreo = existeCorreo.id;
      } else {
        const { data: nCor, error: eCor } = await supabase
          .from("correo")
          .insert([{ email: correo.trim() }])
          .select("id")
          .single();
        if (eCor) throw new Error("Error al guardar correo");
        idCorreo = nCor.id;
      }

      // PASO 2: Insertar contraseña y obtener ID
      const { data: dataPass, error: errorPass } = await supabase
        .from("contrasena") 
        .insert([{ contrasena: password.trim() }]) 
        .select("id")
        .single();

      if (errorPass) throw new Error("Error al guardar contraseña");
      const idPass = dataPass.id;

      // PASO 3: Insertar en la tabla 'registro'
      const { error: errorReg } = await supabase.from("registro").insert([
        {
          nombre_completo: nombre.trim(),
          correo_id: idCorreo, // Revisa si en tu DB es 'coreo_id' o 'correo_id'
          contrasena_id: idPass,
          rol: rolLimpio, // Enviamos 'maestro' o 'alumno' en minúsculas
          grupo_id: grupoId || null,
        },
      ]);

      if (errorReg) {
        console.error("Error DB Registro:", errorReg);
        throw new Error("Error en los datos: " + errorReg.message);
      }

      Alert.alert("Éxito", "Usuario creado correctamente");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const cerrarSesion = () => setUsuario(null);

  return (
    <ContextoAuth.Provider value={{ usuario, iniciarSesion, registro, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  );
}