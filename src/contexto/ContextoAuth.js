import { createContext, useState } from "react";
import { supabase } from "../supabase/supabase";
import { Alert } from "react-native";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const iniciarSesion = async (correo, password, navigation) => {
    try {
      if (!correo || !password) {
        Alert.alert("Error", "Completa todos los campos");
        return;
      }

      const { data: correoData, error: correoError } = await supabase
        .from("correo")
        .select("id")
        .eq("email", correo.trim())
        .single();

      if (correoError || !correoData) {
        Alert.alert("Error", "Correo o contraseña incorrectos");
        return;
      }

      const { data: registroData, error: registroError } = await supabase
        .from("registro")
        .select("*")
        .eq("correo_id", correoData.id)
        .single();

      if (registroError || !registroData) {
        Alert.alert("Error", "Correo o contraseña incorrectos");
        return;
      }

      const { data: passData, error: passError } = await supabase
        .from("contrasena")
        .select("contrasena")
        .eq("id", registroData.contrasena_id)
        .single();

      if (passError || passData.contrasena !== password.trim()) {
        Alert.alert("Error", "Correo o contraseña incorrectos");
        return;
      }

      const usuarioNormalizado = {
        id: registroData.nombre_id,
        rol: registroData.rol,
        grupo_id: registroData.grupo_id,
        nombre: registroData.nombre_completo,
      };

      setUsuario(usuarioNormalizado);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: usuarioNormalizado.rol === "profesor" ? "Maestro" : "Alumno",
          },
        ],
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al iniciar sesión");
    }
  };

  const registro = async (nombre, correo, password, rol, grupoId) => {
    try {
      const rolLimpio = rol.trim().toLowerCase();

      let idCorreo;
      const { data: existeCorreo } = await supabase
        .from("correo")
        .select("id")
        .eq("email", correo.trim())
        .maybeSingle();

      if (existeCorreo) {
        idCorreo = existeCorreo.id;
      } else {
        const { data } = await supabase
          .from("correo")
          .insert([{ email: correo.trim() }])
          .select("id")
          .single();
        idCorreo = data.id;
      }

      const { data: passData } = await supabase
        .from("contrasena")
        .insert([{ contrasena: password.trim() }])
        .select("id")
        .single();

      const { error } = await supabase.from("registro").insert([
        {
          nombre_completo: nombre.trim(),
          correo_id: idCorreo,
          contrasena_id: passData.id,
          rol: rolLimpio,
          grupo_id: rolLimpio === "alumno" ? grupoId : null,
        },
      ]);

      if (error) throw error;

      Alert.alert("Éxito", "Usuario registrado correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al registrar usuario");
    }
  };

  const cerrarSesion = () => setUsuario(null);

  return (
    <ContextoAuth.Provider
      value={{ usuario, iniciarSesion, registro, cerrarSesion }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}
