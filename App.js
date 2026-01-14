import { useContext } from "react";
import { ProveedorAuth, ContextoAuth } from "./src/contexto/ContextoAuth";
import PantallaLogin from "./src/pantallas/PantallaLogin";
import PantallaMaestro from "./src/pantallas/PantallaMaestro";
import PantallaAlumno from "./src/pantallas/PantallaAlumno";

const Principal = () => {
  const { usuario } = useContext(ContextoAuth);

  if (!usuario) return <PantallaLogin />;

  return usuario.rol === "maestro"
    ? <PantallaMaestro />
    : <PantallaAlumno />;
};

export default function App() {
  return (
    <ProveedorAuth>
      <Principal />
    </ProveedorAuth>
  );
}
