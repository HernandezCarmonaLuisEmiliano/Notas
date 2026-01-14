import { StyleSheet, View, Text, Button } from "react-native";
import { useContext } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";

export default function PantallaLogin() {
  const { iniciarSesion } = useContext(ContextoAuth);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar Sesión</Text>

      <View style={estilos.boton}>
        <Button
          title="Entrar como Alumno"
          onPress={() => iniciarSesion("alumno@correo.com", "alumno")}
        />
      </View>

      <View style={estilos.boton}>
        <Button
          title="Entrar como Maestro"
          onPress={() => iniciarSesion("maestro@correo.com", "maestro")}
        />
      </View>
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
  boton: {
    marginBottom: 15,
  },
});
