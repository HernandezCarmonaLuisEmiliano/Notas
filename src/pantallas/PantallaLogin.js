import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useContext, useState, useEffect } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { useNavigation } from "@react-navigation/native";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function PantallaLogin() {
  const { iniciarSesion } = useContext(ContextoAuth);
  const navigation = useNavigation();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [expoToken, setExpoToken] = useState(null);

  useEffect(() => {
    async function obtenerToken() {
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) return;

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        setExpoToken(token);
        console.log("Token capturado en Login:", token);
      } catch (error) {
        console.log("No se pudo obtener el token en esta sesión:", error);
      }
    }
    obtenerToken();
  }, []);

  const handleLogin = () => {
    iniciarSesion(correo, password, navigation, expoToken);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.boton}>
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      </View>

      <View style={styles.botonSecundario}>
        <Button
          title="Registrarse"
          color="#666"
          onPress={() => navigation.navigate("Registro")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  boton: {
    marginTop: 10,
  },
  botonSecundario: {
    marginTop: 15,
  },
});