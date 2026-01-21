import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { ContextoTareas } from "../contexto/ContextoTareas";
import { supabase } from "../supabase/supabase";

export default function PantallaMaestro({ navigation }) {
  const { cerrarSesion } = useContext(ContextoAuth);
  const { tareas, agregarTarea, eliminarTarea } =
    useContext(ContextoTareas);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const [grupos, setGrupos] = useState([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);

  useEffect(() => {
  const cargarGrupos = async () => {
    const { data } = await supabase
      .from("grupos")
      .select("id_grupo, nombre");

    setGrupos(data || []);
  };

  cargarGrupos();
}, []);


  const toggleGrupo = (grupoId) => {
    setGruposSeleccionados((prev) =>
      prev.includes(grupoId)
        ? prev.filter((id) => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const crearTarea = () => {
    if (
      !titulo.trim() ||
      !descripcion.trim() ||
      !fechaEntrega ||
      gruposSeleccionados.length === 0
    ) {
      Alert.alert(
        "Error",
        "Completa todos los campos y selecciona al menos un grupo"
      );
      return;
    }

    agregarTarea(
      titulo.trim(),
      descripcion.trim(),
      fechaEntrega,
      gruposSeleccionados
    );

    setTitulo("");
    setDescripcion("");
    setFechaEntrega("");
    setGruposSeleccionados([]);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigation.replace("Login");
  };

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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

      <TextInput
        placeholder="Fecha de entrega (YYYY-MM-DD)"
        style={estilos.input}
        value={fechaEntrega}
        onChangeText={setFechaEntrega}
      />

      <Text style={estilos.subtitulo}>Asignar a grupos</Text>

      {grupos.map((grupo) => (
  <TouchableOpacity
    key={grupo.id_grupo}
    style={[
      estilos.grupo,
      gruposSeleccionados.includes(grupo.id_grupo) &&
        estilos.grupoSeleccionado,
    ]}
    onPress={() => toggleGrupo(grupo.id_grupo)}
  >
    <Text>{grupo.nombre}</Text>
  </TouchableOpacity>
))}


      <Button title="Agregar tarea" onPress={crearTarea} />

      <Text style={estilos.subtitulo}>Tareas creadas</Text>

      <FlatList
        data={tareas}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.tarea}>
            <Text style={estilos.tituloTarea}>
              {item.titulo}
            </Text>

            <Text>{item.descripcion}</Text>

            <Text style={estilos.fecha}>
              Entrega:{" "}
              {new Date(item.fecha_entrega).toLocaleDateString()}
            </Text>

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
                      onPress: () =>
                        eliminarTarea(item.id),
                    },
                  ]
                )
              }
            />
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
    </ScrollView>
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
  grupo: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  grupoSeleccionado: {
    backgroundColor: "#cce5ff",
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
  fecha: {
    marginTop: 5,
    fontStyle: "italic",
  },
  cerrarSesion: {
    marginTop: 20,
  },
});
