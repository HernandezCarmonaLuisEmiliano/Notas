import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";

export default function PantallaRegistro({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const manejarRegistro = () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    Alert.alert(
      "Registro exitoso",
      "Ahora puedes iniciar sesión",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Registro</Text>

      <TextInput
        placeholder="Nombre completo"
        style={estilos.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Correo electrónico"
        style={estilos.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        style={estilos.input}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <Button title="Registrarse" onPress={manejarRegistro} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
