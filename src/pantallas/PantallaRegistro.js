import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState, useContext, useEffect } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { supabase } from "../supabase/supabase";

export default function PantallaRegistro({ navigation }) {
  const { registro } = useContext(ContextoAuth);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("alumno");
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState(null);

  useEffect(() => {
    const cargarGrupos = async () => {
      const { data } = await supabase
        .from("grupos")
        .select("id, nombre");

      setGrupos(data || []);
    };

    cargarGrupos();
  }, []);

  const handleRegistro = async () => {
    try {
      await registro(nombre, correo, password, rol, grupoId);
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

      {rol === "alumno" && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>
            Selecciona tu grupo
          </Text>

          {grupos.map((g) => (
            <Button
              key={g.id}
              title={g.nombre}
              color={grupoId === g.id ? "#2196f3" : undefined}
              onPress={() => setGrupoId(g.id)}
            />
          ))}
        </View>
      )}

      <View style={{ marginTop: 15 }}>
        <Button title="Registrarse" onPress={handleRegistro} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
