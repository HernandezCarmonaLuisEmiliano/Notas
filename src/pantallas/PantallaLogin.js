import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";

export default function PantallaLogin({ navigation }) {
  const { iniciarSesion } = useContext(ContextoAuth);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const usuario = await iniciarSesion(correo, password);

      if (usuario.rol === "maestro") {
        navigation.replace("Maestro");
      } else {
        navigation.replace("Alumno");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo"
        style={estilos.input}
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={estilos.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Iniciar Sesión" onPress={handleLogin} />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Registrarse"
          onPress={() => navigation.navigate("Registro")}
        />
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
