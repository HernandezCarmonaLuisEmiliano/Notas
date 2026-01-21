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

  /* ================= OBTENER TAREAS ================= */
  const obtenerTareas = async () => {
    setCargando(true);

    /* ---------- PROFESOR ---------- */
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
    }

    /* ---------- ALUMNO ---------- */
    if (usuario.rol === "alumno") {
      const { data, error } = await supabase
        .from("tareas")
        .select(`
          id,
          titulo,
          descripcion,
          fecha_entrega,
          entregas (
            id
          )
        `);

      setCargando(false);

      if (error) {
        console.error(error);
        alert("Error al cargar tareas del alumno");
        return;
      }

      // Solo tareas NO entregadas
      const pendientes = data.filter(
        (tarea) => tarea.entregas.length === 0
      );

      setTareas(pendientes);
    }
  };

  /* ================= CREAR TAREA (PROFESOR) ================= */
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
        registro_id: usuario.id, // ✅ CORRECTO
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error al crear tarea");
      return;
    }

    obtenerTareas();
  };

  /* ================= ENTREGAR TAREA (ALUMNO) ================= */
  const entregarTarea = async (tareaId) => {
    const { error } = await supabase.from("entregas").insert([
      {
        tarea_id: tareaId,
        alumno_id: usuario.id,
      },
    ]);

    if (error) {
      alert("La tarea ya fue entregada o ocurrió un error");
      return;
    }

    obtenerTareas();
  };

  /* ================= ELIMINAR TAREA ================= */
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
        entregarTarea,
        cargando,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
