import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { ContextoAuth } from "./ContextoAuth";

export const ContextoTareas = createContext();

export function ContextoTareasProvider({ children }) {
  const { usuario } = useContext(ContextoAuth);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // ======================
  // CARGAR TAREAS AL LOGIN
  // ======================
  useEffect(() => {
    if (usuario?.id) {
      obtenerTareas();
    } else {
      setTareas([]);
    }
  }, [usuario]);

  // ======================
  // OBTENER TAREAS
  // ======================
  const obtenerTareas = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("tareas")
      .select("*")
      .eq("usuario_id", usuario.id)
      .order("created_at", { ascending: false });

    setCargando(false);

    if (error) {
      console.error("❌ Error al cargar tareas:", error);
      alert("Error al cargar tareas");
      return;
    }

    setTareas(data || []);
  };

  // ======================
  // AGREGAR TAREA
  // ======================
  const agregarTarea = async (titulo, descripcion) => {
    if (!titulo || !descripcion) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase.from("tareas").insert([
      {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        usuario_id: usuario.id,
      },
    ]);

    if (error) {
      console.error("❌ Error al guardar tarea:", error);
      alert("Error al guardar tarea");
      return;
    }

    obtenerTareas(); // 🔄 refrescar lista
  };

  // ======================
  // ELIMINAR TAREA
  // ======================
  const eliminarTarea = async (id) => {
    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Error al eliminar tarea:", error);
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
