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

    if (usuario.rol === "profesor") {
      const { data, error } = await supabase
        .from("tareas")
        .select("*")
        .eq("registro_id", usuario.id)
        .order("fecha_entrega", { ascending: true });

      setCargando(false);

      if (error) {
        console.error(error);
        alert("Error al cargar tareas del profesor");
        return;
      }

      setTareas(data || []);
      return;
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
            entregas (
              alumno_id
            )
          )
        `)
        .eq("grupo_id", usuario.grupo_id);

      setCargando(false);

      if (error) {
        console.error(error);
        alert("Error al cargar tareas del alumno");
        return;
      }

      const pendientes = data
        .map((row) => row.tareas)
        .filter(
          (tarea) =>
            !tarea.entregas.some(
              (entrega) => entrega.alumno_id === usuario.id
            )
        );

      setTareas(pendientes);
    }
  };

  const agregarTarea = async (titulo, descripcion, fechaEntrega, gruposIds) => {
    if (!titulo || !descripcion || !fechaEntrega || !gruposIds?.length) {
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
          registro_id: usuario.id,
        },
      ])
      .select()
      .single();

    if (error || !tarea) {
      console.error(error);
      alert("Error al crear la tarea");
      return;
    }

    const relaciones = gruposIds.map((grupoId) => ({
      tarea_id: tarea.id,
      grupo_id: grupoId,
    }));

    const { error: relError } = await supabase
      .from("tareas_grupos")
      .insert(relaciones);

    if (relError) {
      console.error(relError);
      alert("Error al asignar grupos a la tarea");
      return;
    }

    obtenerTareas();
  };

  const entregarTarea = async (tareaId) => {
    const { error } = await supabase.from("entregas").insert([
      {
        tarea_id: tareaId,
        alumno_id: usuario.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert("La tarea ya fue entregada o ocurrió un error");
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

    obtenerTareas();
  };

  return (
    <ContextoTareas.Provider
      value={{
        tareas,
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
