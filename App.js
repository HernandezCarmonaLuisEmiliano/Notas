import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PantallaLogin from "./src/pantallas/PantallaLogin";
import PantallaRegistro from "./src/pantallas/PantallaRegistro";
import PantallaAlumno from "./src/pantallas/PantallaAlumno";
import PantallaMaestro from "./src/pantallas/PantallaMaestro";

import { ContextoAuthProvider } from "./src/contexto/ContextoAuth";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ContextoAuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={PantallaLogin} />
          <Stack.Screen name="Registro" component={PantallaRegistro} />
          <Stack.Screen name="Alumno" component={PantallaAlumno} />
          <Stack.Screen name="Maestro" component={PantallaMaestro} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextoAuthProvider>
  );
}
