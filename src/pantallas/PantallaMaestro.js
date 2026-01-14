import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { useContext, useState } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { ContextoTareas } from "../contexto/ContextoTareas";

export default function PantallaMaestro({ navigation }) {
  const { usuario, cerrarSesion } = useContext(ContextoAuth);
  const { tareas, agregarTarea, eliminarTarea } =
    useContext(ContextoTareas);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const crearTarea = () => {
    if (!titulo || !descripcion) return;
    agregarTarea(titulo, descripcion);
    setTitulo("");
    setDescripcion("");
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Maestro</Text>
      <Text>Bienvenido: {usuario?.correo}</Text>

      <Text style={estilos.subtitulo}>Nueva tarea</Text>

      <TextInput
        placeholder="Título"
        style={estilos.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        placeholder="Descripción"
        style={estilos.input}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Agregar tarea" onPress={crearTarea} />

      <Text style={estilos.subtitulo}>Tareas creadas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={estilos.tarea}>
            <Text style={estilos.tituloTarea}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>

            <Button
              title="Eliminar"
              color="red"
              onPress={() => eliminarTarea(item.id)}
            />
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
  subtitulo: { fontSize: 18, marginVertical: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tarea: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tituloTarea: { fontWeight: "bold" },
});
