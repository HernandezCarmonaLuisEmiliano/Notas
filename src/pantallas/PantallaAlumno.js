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
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";

export default function PantallaAlumno({ navigation }) {
  const { usuario, cerrarSesion, actualizarFrecuencia } = useContext(ContextoAuth);
  const { tareas, entregarTarea } = useContext(ContextoTareas);

  const manejarCambioFrecuencia = async (valor) => {
    const exito = await actualizarFrecuencia(valor);
    
    if (exito) {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (valor !== "Nunca") {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "✅ Configuración Actualizada",
            body: `Frecuencia seleccionada: "${valor}"`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });

        let segundos = 86400;
        if (valor === "Cada 2 días") segundos = 172800;
        if (valor === "Semanal") segundos = 604800;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Recordatorio de Tareas",
            body: "No olvides revisar tus tareas pendientes hoy.",
          },
          trigger: { 
            seconds: segundos, 
            repeats: true 
          },
        });
        
        Alert.alert("Éxito", `Se ha configurado la frecuencia: ${valor}`);
      } else {
        Alert.alert("Éxito", "Recordatorios desactivados");
      }
    }
  };

  const confirmarEntrega = (id) => {
    Alert.alert(
      "Entregar tarea",
      "¿Estás seguro de entregar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Entregar", onPress: () => entregarTarea(id) },
      ]
    );
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel del Alumno</Text>
      <Text style={estilos.subtitulo}>Bienvenido: {usuario?.nombre}</Text>

      <View style={estilos.seccionConfig}>
        <Text style={estilos.label}>Recordarme tareas pendientes:</Text>
        <View style={estilos.pickerContainer}>
          <Picker
            selectedValue={usuario?.frecuencia_notificaciones || "Diario"}
            onValueChange={(itemValue) => manejarCambioFrecuencia(itemValue)}
          >
            <Picker.Item label="Diario" value="Diario" />
            <Picker.Item label="Cada 2 días" value="Cada 2 días" />
            <Picker.Item label="Semanal" value="Semanal" />
            <Picker.Item label="Nunca" value="Nunca" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={tareas.filter((t) => !t.entregada)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const vencida = new Date(item.fecha_entrega) < new Date();

          return (
            <View style={estilos.tarea}>
              <Text style={estilos.tituloTarea}>{item.titulo}</Text>
              <Text>{item.descripcion}</Text>
              <Text style={estilos.fecha}>
                Entrega: {new Date(item.fecha_entrega).toLocaleDateString()}
              </Text>

              {vencida ? (
                <Text style={estilos.vencida}>Tarea vencida</Text>
              ) : (
                <Button
                  title="Entregar tarea"
                  onPress={() => confirmarEntrega(item.id)}
                />
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={estilos.vacio}>No hay tareas pendientes</Text>}
      />

      <View style={estilos.botonSalir}>
        <Button
          title="Cerrar sesión"
          color="#FF4444"
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
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  seccionConfig: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  tarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  tituloTarea: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fecha: {
    marginTop: 5,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  vencida: {
    marginTop: 5,
    color: "red",
    fontWeight: "bold",
  },
  vacio: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  botonSalir: {
    marginTop: 10,
    marginBottom: 20,
  },
});