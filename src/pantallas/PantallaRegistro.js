import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useContext, useEffect } from "react";
import { ContextoAuth } from "../contexto/ContextoAuth";
import { supabase } from "../supabase/supabase";
import { Picker } from "@react-native-picker/picker";

export default function PantallaRegistro({ navigation }) {
  const { registro } = useContext(ContextoAuth);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("alumno");
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarGrupos = async () => {
      const { data, error } = await supabase
        .from("grupos")
        .select("id, nombre");
      if (!error) setGrupos(data);
    };
    cargarGrupos();
  }, []);

  const handleRegistro = async () => {
    // Validación local rápida
    if (!nombre || !correo || !password) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    setCargando(true);
    try {
      // El rol se envía tal cual, el ContextoAuth se encargará de normalizarlo
      await registro(nombre, correo, password, rol, grupoId);
      // Nota: El alert de éxito ya lo pusimos en el Contexto, 
      // pero si quieres uno aquí, es mejor usar Alert.alert
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error de Registro", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Crear Cuenta</Text>

      <TextInput
        placeholder="Nombre Completo"
        style={estilos.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Correo electrónico"
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

      <Text style={estilos.etiqueta}>Selecciona tu función:</Text>
      <View style={estilos.botonesRol}>
        <Button 
          title="Soy Alumno" 
          onPress={() => setRol("alumno")} 
          color={rol === "alumno" ? "#2196F3" : "#ccc"}
        />
        <Button 
          title="Soy Maestro" 
          onPress={() => setRol("maestro")} 
          color={rol === "maestro" ? "#2196F3" : "#ccc"}
        />
      </View>

      {rol === "alumno" && (
        <View style={estilos.pickerContainer}>
          <Text style={{ marginLeft: 10, marginTop: 5 }}>Selecciona tu Grupo:</Text>
          <Picker
            selectedValue={grupoId}
            onValueChange={(value) => setGrupoId(value)}
          >
            <Picker.Item label="Toca para elegir..." value={null} />
            {grupos.map((grupo) => (
              <Picker.Item key={grupo.id} label={grupo.nombre} value={grupo.id} />
            ))}
          </Picker>
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        {cargando ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Finalizar Registro" onPress={handleRegistro} />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: '#fff' },
  titulo: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8 },
  etiqueta: { marginBottom: 10, fontWeight: '600' },
  botonesRol: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15 },
});