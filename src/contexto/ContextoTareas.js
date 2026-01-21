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
      obtenerTareas();
    } else {
      setTareas([]);
    }
  }, [usuario]);

  const obtenerTareas = async () => {
    setCargando(true);

    // 👨‍🏫 MAESTRO
    if (usuario.rol === "maestro") {
      const { data, error } = await supabase
        .from("tareas")
        .select("*")
        .eq("registro_id", usuario.id)
        .order("fecha_entrega", { ascending: true });

      setCargando(false);

      if (error) {
        console.error(error);
        alert("Error al cargar tareas");
        return;
      }

      setTareas(data || []);
    }

    // 👨‍🎓 ALUMNO
    if (usuario.rol === "alumno") {
      const { data, error } = await supabase
        .from("tareas_grupos")
        .select(`
          tareas (
            id,
            titulo,
            descripcion,
            fecha_entrega
          )
        `)
        .eq("grupo_id", usuario.grupo_id);

      setCargando(false);

      if (error) {
        console.error(error);
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
          registro_id: usuario.id, // 👈 CLAVE CORRECTA
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
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
      console.error(errorRel);
      alert("Error al asignar grupos");
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
      console.error(error);
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
        cargando,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
