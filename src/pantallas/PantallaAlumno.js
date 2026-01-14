import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { ContextoTareas } from "../contexto/ContextoTareas";

export default function PantallaAlumno({ navigation }) {
  const { usuario, cerrarSesion } = useContext(ContextoAuth);
  const { tareas } = useContext(ContextoTareas);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Alumno</Text>
      <Text>Bienvenido: {usuario?.correo}</Text>

      <Text style={estilos.subtitulo}>Tareas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={estilos.tarea}>
            <Text style={estilos.tituloTarea}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay tareas aún</Text>}
      />

      <View style={estilos.boton}>
        <Button
          title="Cerrar sesión"
          onPress={() => {
            cerrarSesion();
            navigation.replace("Login");
          }}
        />
      </View>
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    marginVertical: 10,
  },
  tarea: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  tituloTarea: {
    fontWeight: "bold",
  },
  boton: {
    marginTop: 20,
  },
});
