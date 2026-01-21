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

  const limpiarTareasVencidas = async () => {
    const ahora = new Date().toISOString();

    await supabase
      .from("tareas")
      .delete()
      .lt("fecha_entrega", ahora)
      .eq("entregada", false)
      .eq("usuario_id", usuario.id);
  };

  const obtenerTareas = async () => {
    setCargando(true);

    if (usuario.rol === "maestro") {
      const { data, error } = await supabase
        .from("tareas")
        .select("*")
        .eq("usuario_id", usuario.id)
        .order("fecha_entrega", { ascending: true });

      setCargando(false);

      if (error) {
        alert("Error al cargar tareas");
        return;
      }

      setTareas(data);
    }

    if (usuario.rol === "alumno") {
      const { data, error } = await supabase
        .from("tareas_grupos")
        .select(`
          tareas (
            id,
            titulo,
            descripcion,
            fecha_entrega,
            entregada
          )
        `)
        .eq("grupo_id", usuario.grupo_id);

      setCargando(false);

      if (error) {
        alert("Error al cargar tareas");
        return;
      }

      setTareas(data.map((t) => t.tareas));
    }
  };

  const agregarTarea = async (titulo, descripcion, fechaEntrega, gruposIds) => {
    if (!titulo || !descripcion || !fechaEntrega || gruposIds.length === 0) {
      alert("Completa todos los campos y selecciona al menos un grupo");
      return;
    }

    const fechaISO = new Date(fechaEntrega).toISOString();

    const { data: tarea, error } = await supabase
      .from("tareas")
      .insert([
        {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          fecha_entrega: fechaISO,
          usuario_id: usuario.id,
          entregada: false,
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Error al crear tarea");
      return;
    }

    const relaciones = gruposIds.map((grupoId) => ({
      tarea_id: tarea.id,
      grupo_id: grupoId,
    }));

    const { error: errorRel } = await supabase
      .from("tareas_grupos")
      .insert(relaciones);

    if (errorRel) {
      alert("Error al asignar grupos");
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
