import * as Notifications from "expo-notifications";

export async function programarNotificacion(
  titulo,
  cuerpo,
  frecuencia
) {
  let trigger = null;

  if (frecuencia === "Diario") {
    trigger = { seconds: 10, repeats: true };
  }

  if (frecuencia === "Semanal") {
    trigger = { seconds: 604800, repeats: true };
  }

  if (!trigger) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
    },
    trigger,
  });

  return id;
}

export async function cancelarNotificacion(id) {
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}
