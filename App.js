import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PantallaLogin from "./src/pantallas/PantallaLogin";
import PantallaRegistro from "./src/pantallas/PantallaRegistro";
import PantallaAlumno from "./src/pantallas/PantallaAlumno";
import PantallaMaestro from "./src/pantallas/PantallaMaestro";

import { ContextoAuthProvider } from "./src/contexto/ContextoAuth";
import { ContextoTareasProvider } from "./src/contexto/ContextoTareas";

import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <ContextoAuthProvider>
      <ContextoTareasProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={PantallaLogin} />
            <Stack.Screen name="Registro" component={PantallaRegistro} />
            <Stack.Screen name="Alumno" component={PantallaAlumno} />
            <Stack.Screen name="Maestro" component={PantallaMaestro} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextoTareasProvider>
    </ContextoAuthProvider>
  );
}
