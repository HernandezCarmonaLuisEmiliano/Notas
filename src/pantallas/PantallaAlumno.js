import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
} from "react-native";
import { useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { ContextoTareas } from "../contexto/ContextoTareas";

export default function PantallaAlumno({ navigation }) {
  const { usuario, cerrarSesion } = useContext(ContextoAuth);
  const { tareas, cambiarFrecuencia } =
    useContext(ContextoTareas);

  const opciones = ["Diario", "Semanal", "Nunca"];

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Alumno</Text>
      <Text>Bienvenido: {usuario?.correo}</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={estilos.tarea}>
            <Text style={estilos.tituloTarea}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>
            <Text>Frecuencia: {item.frecuencia}</Text>

            {opciones.map((opcion) => (
              <Button
                key={opcion}
                title={opcion}
                onPress={() =>
                  cambiarFrecuencia(item.id, opcion)
                }
              />
            ))}
          </View>
        )}
        ListEmptyComponent={<Text>No hay tareas</Text>}
      />

      <Button
        title="Cerrar sesión"
        onPress={() => {
          cerrarSesion();
          navigation.replace("Login");
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  tarea: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tituloTarea: { fontWeight: "bold" },
});
