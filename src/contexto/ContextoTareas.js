import { createContext, useState } from "react";

export const ContextoTareas = createContext();

export function ContextoTareasProvider({ children }) {
  const [tareas, setTareas] = useState([]);

  const agregarTarea = (titulo, descripcion) => {
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      frecuencia: "Diario", // por defecto
    };
    setTareas([...tareas, nuevaTarea]);
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  const cambiarFrecuencia = (id, nuevaFrecuencia) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id
          ? { ...tarea, frecuencia: nuevaFrecuencia }
          : tarea
      )
    );
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
