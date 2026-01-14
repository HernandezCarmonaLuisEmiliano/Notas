import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import { useState } from "react";

export default function PantallaAlumno() {
  const [tareas, setTareas] = useState([
    { id: "1", titulo: "Matemáticas", frecuencia: "Diaria" },
    { id: "2", titulo: "Historia", frecuencia: "Semanal" },
    { id: "3", titulo: "Ciencias", frecuencia: "Mensual" },
  ]);

  const cambiarFrecuencia = (id) => {
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === id
          ? {
              ...tarea,
              frecuencia:
                tarea.frecuencia === "Diaria"
                  ? "Semanal"
                  : tarea.frecuencia === "Semanal"
                  ? "Mensual"
                  : "Diaria",
            }
          : tarea
      )
    );
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Mis Tareas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <Text style={estilos.textoTitulo}>📘 {item.titulo}</Text>
            <Text style={estilos.textoFrecuencia}>
              🔔 Avisos: {item.frecuencia}
            </Text>

            <View style={estilos.boton}>
              <Button
                title="Cambiar frecuencia"
                onPress={() => cambiarFrecuencia(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={estilos.vacio}>
            No hay tareas asignadas
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
  lista: {
    paddingBottom: 20,
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  textoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  textoFrecuencia: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  boton: {
    marginTop: 5,
  },
  vacio: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
