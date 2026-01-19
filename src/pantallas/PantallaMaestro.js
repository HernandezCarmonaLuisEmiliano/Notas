import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
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
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert(
        "Error",
        "El título y la descripción son obligatorios"
      );
      return;
    }

    agregarTarea(titulo.trim(), descripcion.trim());
    setTitulo("");
    setDescripcion("");
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigation.replace("Login");
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Maestro</Text>

      <Text style={estilos.subtitulo}>Crear nueva tarea</Text>

      <TextInput
        placeholder="Título de la tarea"
        style={estilos.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        placeholder="Descripción de la tarea"
        style={estilos.input}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Agregar tarea" onPress={crearTarea} />

      <Text style={estilos.subtitulo}>Tareas creadas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.tarea}>
            <Text style={estilos.tituloTarea}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>

            <View style={estilos.botonEliminar}>
              <Button
                title="Eliminar"
                color="red"
                onPress={() =>
                  Alert.alert(
                    "Confirmar",
                    "¿Deseas eliminar esta tarea?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => eliminarTarea(item.id),
                      },
                    ]
                  )
                }
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text>No hay tareas creadas</Text>
        }
      />

      <View style={estilos.cerrarSesion}>
        <Button
          title="Cerrar sesión"
          color="#444"
          onPress={handleCerrarSesion}
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
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tituloTarea: {
    fontWeight: "bold",
  },
  botonEliminar: {
    marginTop: 5,
  },
  cerrarSesion: {
    marginTop: 15,
  },
});
