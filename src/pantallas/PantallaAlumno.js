import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Alert,
} from "react-native";
import { useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { ContextoTareas } from "../contexto/ContextoTareas";

export default function PantallaAlumno({ navigation }) {
  const { usuario, cerrarSesion } = useContext(ContextoAuth);
  const { tareas, entregarTarea } = useContext(ContextoTareas);

  const confirmarEntrega = (id) => {
    Alert.alert(
      "Entregar tarea",
      "¿Estás seguro de entregar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Entregar",
          onPress: () => entregarTarea(id),
        },
      ]
    );
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Alumno</Text>
      <Text>Bienvenido: {usuario?.nombre}</Text>

      <FlatList
        data={tareas.filter((t) => !t.entregada)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const vencida =
            new Date(item.fecha_entrega) < new Date();

          return (
            <View style={estilos.tarea}>
              <Text style={estilos.tituloTarea}>
                {item.titulo}
              </Text>

              <Text>{item.descripcion}</Text>

              <Text style={estilos.fecha}>
                Entrega:{" "}
                {new Date(
                  item.fecha_entrega
                ).toLocaleDateString()}
              </Text>

              {vencida ? (
                <Text style={estilos.vencida}>
                   Tarea vencida
                </Text>
              ) : (
                <Button
                  title="Entregar tarea"
                  onPress={() =>
                    confirmarEntrega(item.id)
                  }
                />
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text>No hay tareas pendientes</Text>
        }
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
  contenedor: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  tarea: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tituloTarea: {
    fontWeight: "bold",
  },
  fecha: {
    marginTop: 5,
    fontStyle: "italic",
  },
  vencida: {
    marginTop: 5,
    color: "red",
    fontWeight: "bold",
  },
});
