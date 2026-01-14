import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useContext, useState } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";

export default function PantallaLogin({ navigation }) {
  const { iniciarSesion } = useContext(ContextoAuth);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const validarCampos = () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Completa todos los campos");
      return false;
    }
    return true;
  };

  const loginAlumno = () => {
    if (validarCampos()) {
      iniciarSesion(correo, "alumno");
      navigation.replace("Alumno");
    }
  };

  const loginMaestro = () => {
    if (validarCampos()) {
      iniciarSesion(correo, "maestro");
      navigation.replace("Maestro");
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar Sesión</Text>

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

      <View style={estilos.boton}>
        <Button title="Entrar como Alumno" onPress={loginAlumno} />
      </View>

      <View style={estilos.boton}>
        <Button title="Entrar como Maestro" onPress={loginMaestro} />
      </View>

      <TouchableOpacity
        style={estilos.registro}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={estilos.textoRegistro}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
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
  boton: {
    marginBottom: 15,
  },
  registro: {
    marginTop: 20,
    alignItems: "center",
  },
  textoRegistro: {
    color: "#1e90ff",
    fontSize: 16,
  },
});
