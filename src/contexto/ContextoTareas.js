import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { ContextoAuth } from "./ContextoAuth";

export const ContextoTareas = createContext();

export function ContextoTareasProvider({ children }) {
  const { usuario } = useContext(ContextoAuth);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario?.id) {
      if (usuario.rol === "maestro") {
        limpiarTareasVencidas();
      }
      obtenerTareas();
    } else {
      setTareas([]);
    }
  }, [usuario]);

  // 🔹 BORRA SOLO TAREAS VENCIDAS NO ENTREGADAS
  const limpiarTareasVencidas = async () => {
    const ahora = new Date().toISOString();

    await supabase
      .from("tareas")
      .delete()
      .lt("fecha_entrega", ahora)
      .eq("entregada", false);
  };

  const obtenerTareas = async () => {
    setCargando(true);

    let query = supabase.from("tareas").select("*");

    if (usuario.rol === "maestro") {
      query = query.eq("usuario_id", usuario.id);
    }

    if (usuario.rol === "alumno") {
      query = query.eq("grupo_id", usuario.grupo_id);
    }

    const { data, error } = await query.order("fecha_entrega", {
      ascending: true,
    });

    setCargando(false);

    if (error) {
      alert("Error al cargar tareas");
      return;
    }

    setTareas(data);
  };

  // 🔹 CONVIERTE FECHA A FORMATO ISO
  const agregarTarea = async (titulo, descripcion, fechaEntrega) => {
    if (!titulo || !descripcion || !fechaEntrega) {
      alert("Completa todos los campos");
      return;
    }

    const fechaISO = new Date(fechaEntrega).toISOString();

    const { error } = await supabase.from("tareas").insert([
      {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fecha_entrega: fechaISO,
        usuario_id: usuario.id,
        grupo_id: usuario.grupo_id,
        entregada: false,
      },
    ]);

    if (error) {
      console.error("Error al guardar tarea:", error);
      alert("Error al guardar tarea");
      return;
    }

    obtenerTareas();
  };

  const entregarTarea = async (id) => {
    const { error } = await supabase
      .from("tareas")
      .update({ entregada: true })
      .eq("id", id);

    if (error) {
      alert("Error al entregar tarea");
      return;
    }

    obtenerTareas();
  };

  const eliminarTarea = async (id) => {
    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar tarea");
      return;
    }

    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ContextoTareas.Provider
      value={{
        tareas,
        cargarTareas: obtenerTareas,
        agregarTarea,
        eliminarTarea,
        entregarTarea,
        cargando,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
