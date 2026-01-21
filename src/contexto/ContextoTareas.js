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

  // 📥 OBTENER TAREAS
  const obtenerTareas = async () => {
    setCargando(true);

    // 👨‍🏫 MAESTRO → ve solo sus tareas
    if (usuario.rol === "profesor") {
      const { data, error } = await supabase
        .from("tareas")
        .select("*")
        .eq("usuario_id", usuario.id)
        .order("fecha_entrega", { ascending: true });

      setCargando(false);

      if (error) {
        alert("Error al cargar tareas del profesor");
        return;
      }

      setTareas(data || []);
    }

    // 👨‍🎓 ALUMNO → tareas por grupo
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
        console.error(error);
        alert("Error al cargar tareas del alumno");
        return;
      }

      setTareas(data.map((row) => row.tareas));
    }
  };

  // ➕ CREAR TAREA
  const agregarTarea = async (titulo, descripcion, fechaEntrega, gruposIds) => {
    if (!titulo || !descripcion || !fechaEntrega || gruposIds.length === 0) {
      alert("Completa todos los campos y selecciona al menos un grupo");
      return;
    }

    const fechaISO = new Date(fechaEntrega).toISOString();

    // 1️⃣ Crear tarea
    const { data: tarea, error } = await supabase
      .from("tareas")
      .insert([
        {
          titulo,
          descripcion,
          fecha_entrega: fechaISO,
          usuario_id: usuario.id,
          entregada: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Error al crear tarea");
      return;
    }

    // 2️⃣ Relacionar con grupos
    const relaciones = gruposIds.map((grupoId) => ({
      tarea_id: tarea.id,
      grupo_id: grupoId,
    }));

    const { error: relError } = await supabase
      .from("tareas_grupos")
      .insert(relaciones);

    if (relError) {
      console.error(relError);
      alert("Error al asignar grupos");
      return;
    }

    obtenerTareas();
  };

  const eliminarTarea = async (id) => {
    await supabase.from("tareas").delete().eq("id", id);
    obtenerTareas();
  };

  return (
    <ContextoTareas.Provider
      value={{
        tareas,
        agregarTarea,
        eliminarTarea,
        cargando,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
