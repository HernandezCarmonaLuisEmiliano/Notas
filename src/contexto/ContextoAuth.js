import { createContext, useState } from "react";
import { supabase } from "../supabase/supabase";
import { Alert } from "react-native";

export const ContextoAuth = createContext();

export function ContextoAuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const guardarTokenBD = async (nombreId, token) => {
    if (!nombreId || !token) return;
    
    const { error } = await supabase
      .from("registro")
      .update({ token_notificacion: token })
      .eq("nombre_id", nombreId);

    if (error) console.log("Error al guardar token:", error.message);
    else console.log("Token actualizado en tabla registro");
  };

  const iniciarSesion = async (correo, password, navigation, expoToken) => {
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

      if (expoToken) {
        await guardarTokenBD(usuarioNormalizado.id, expoToken);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: usuarioNormalizado.rol === "profesor" ? "Maestro" : "Alumno" }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al iniciar sesión");
    }
  };

const actualizarFrecuencia = async (nuevaFrecuencia) => {
  if (!usuario) return;

  try {
    const { error } = await supabase
      .from("registro")
      .update({ frecuencia_notificaciones: nuevaFrecuencia })
      .eq("nombre_id", usuario.id);

    if (error) throw error;

    setUsuario({ ...usuario, frecuencia_notificaciones: nuevaFrecuencia });
    
    return true;
  } catch (error) {
    console.error("Error al actualizar frecuencia:", error);
    return false;
  }
};

  const registro = async (nombre, correo, password, rol, grupoId, expoToken) => {
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

      const { data: nuevoRegistro, error } = await supabase
        .from("registro")
        .insert([
          {
            nombre_completo: nombre.trim(),
            correo_id: idCorreo,
            contrasena_id: passData.id,
            rol: rolLimpio,
            grupo_id: rolLimpio === "alumno" ? grupoId : null,
          },
        ])
        .select("nombre_id")
        .single();

      if (error) throw error;

      if (expoToken && nuevoRegistro) {
        await guardarTokenBD(nuevoRegistro.nombre_id, expoToken);
      }

      Alert.alert("Éxito", "Usuario registrado correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al registrar usuario");
    }
  };

  const cerrarSesion = () => setUsuario(null);

  return (
    <ContextoAuth.Provider
      value={{ usuario, iniciarSesion, registro, cerrarSesion, actualizarFrecuencia }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}