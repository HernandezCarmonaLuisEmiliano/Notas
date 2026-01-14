import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { useState } from "react";

export default function PantallaMaestro() {
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [tareas, setTareas] = useState([]);

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") return;

    setTareas([
      ...tareas,
      {
        id: Date.now().toString(),
        titulo: nuevaTarea,
      },
    ]);
    setNuevaTarea("");
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Maestro</Text>

      <View style={estilos.formulario}>
        <TextInput
          style={estilos.input}
          placeholder="Escribe la nueva tarea"
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
        />

        <View style={estilos.boton}>
          <Button title="Agregar tarea" onPress={agregarTarea} />
        </View>
      </View>

      <Text style={estilos.subtitulo}>Tareas creadas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <Text style={estilos.textoTarea}>📘 {item.titulo}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={estilos.vacio}>
            No hay tareas aún
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formulario: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  boton: {
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  lista: {
    paddingBottom: 20,
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  textoTarea: {
    fontSize: 16,
  },
  vacio: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
