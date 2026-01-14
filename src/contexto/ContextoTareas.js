import { createContext, useState } from "react";
import {
  programarNotificacion,
  cancelarNotificacion,
} from "../utilidades/notificaciones";

export const ContextoTareas = createContext();

export function ContextoTareasProvider({ children }) {
  const [tareas, setTareas] = useState([]);

  // ======================
  // CREAR TAREA (MAESTRO)
  // ======================
  const agregarTarea = (titulo, descripcion) => {
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      frecuencia: "Nunca",
      notificacionId: null,
    };

    setTareas((prev) => [...prev, nuevaTarea]);
  };

  // ======================
  // ELIMINAR TAREA (MAESTRO)
  // ======================
  const eliminarTarea = async (id) => {
    setTareas((prev) => {
      const tarea = prev.find((t) => t.id === id);

      if (tarea?.notificacionId) {
        cancelarNotificacion(tarea.notificacionId);
      }

      return prev.filter((t) => t.id !== id);
    });
  };

  // ======================
  // CAMBIAR FRECUENCIA (ALUMNO)
  // ======================
  const cambiarFrecuencia = (id, nuevaFrecuencia) => {
    setTareas((prev) => {
      const tarea = prev.find((t) => t.id === id);

      // Cancelar notificación anterior
      if (tarea?.notificacionId) {
        cancelarNotificacion(tarea.notificacionId);
      }

      // Si es "Nunca", solo cancelar
      if (nuevaFrecuencia === "Nunca") {
        return prev.map((t) =>
          t.id === id
            ? {
                ...t,
                frecuencia: "Nunca",
                notificacionId: null,
              }
            : t
        );
      }

      // Programar nueva notificación
      programarNotificacion(
        "Recordatorio de tarea",
        tarea.titulo,
        nuevaFrecuencia
      ).then((nuevaNotificacionId) => {
        setTareas((actual) =>
          actual.map((t) =>
            t.id === id
              ? { ...t, notificacionId: nuevaNotificacionId }
              : t
          )
        );
      });

      return prev.map((t) =>
        t.id === id
          ? { ...t, frecuencia: nuevaFrecuencia }
          : t
      );
    });
  };

  return (
    <ContextoTareas.Provider
      value={{
        tareas,
        agregarTarea,
        eliminarTarea,
        cambiarFrecuencia,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
