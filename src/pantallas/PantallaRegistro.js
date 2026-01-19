import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";

export default function PantallaRegistro({ navigation }) {
  const { registro } = useContext(ContextoAuth);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("alumno");

  const handleRegistro = async () => {
    try {
      await registro(nombre, correo, password, rol);
      alert("Usuario registrado correctamente");
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        style={estilos.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Correo"
        style={estilos.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={estilos.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={`Rol: ${rol}`}
        onPress={() =>
          setRol(rol === "alumno" ? "maestro" : "alumno")
        }
      />

      <View style={{ marginTop: 15 }}>
        <Button title="Registrarse" onPress={handleRegistro} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
