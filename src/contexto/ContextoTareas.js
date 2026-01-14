import { createContext, useState } from "react";

export const ContextoTareas = createContext();

export function ContextoTareasProvider({ children }) {
  const [tareas, setTareas] = useState([]);

  const agregarTarea = (titulo, descripcion) => {
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo,
      descripcion,
    };
    setTareas([...tareas, nuevaTarea]);
  };

  return (
    <ContextoTareas.Provider
      value={{
        tareas,
        agregarTarea,
      }}
    >
      {children}
    </ContextoTareas.Provider>
  );
}
