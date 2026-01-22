import { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PantallaLogin from "./src/pantallas/PantallaLogin";
import PantallaRegistro from "./src/pantallas/PantallaRegistro";
import PantallaAlumno from "./src/pantallas/PantallaAlumno";
import PantallaMaestro from "./src/pantallas/PantallaMaestro";

import { ContextoAuthProvider } from "./src/contexto/ContextoAuth";
import { ContextoTareasProvider } from "./src/contexto/ContextoTareas";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
})

export default function App() {
  
  useEffect(() => {
    async function configurarNotificaciones() {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        console.error("Error: No se encontró el Project ID en app.json. Ejecuta 'eas init'.");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permiso de notificaciones rechazado");
        return;
      }

      try {
        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log("-----------------------------------------");
        console.log("9a2dbb77-15bc-4078-a48a-b2d80027be9f");
        console.log(token);
        console.log("-----------------------------------------");
      } catch (error) {
        console.error("Error al obtener el token:", error);
      }
    }

    configurarNotificaciones();
  }, []);

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