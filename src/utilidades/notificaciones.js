import * as Notifications from "expo-notifications";

// ======================
// PROGRAMAR NOTIFICACIÓN
// ======================
export async function programarNotificacion(
  titulo,
  cuerpo,
  frecuencia
) {
  let trigger = null;

  // 🔁 Diario (cada 24 horas)
  if (frecuencia === "Diario") {
    trigger = {
      seconds: 86400, // 24 horas
      repeats: true,
    };
  }

  // 🔁 Semanal (cada 7 días)
  if (frecuencia === "Semanal") {
    trigger = {
      seconds: 604800, // 7 días
      repeats: true,
    };
  }

  // 🚫 Nunca
  if (!trigger) {
    return null;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
    },
    trigger,
  });

  return id;
}

// ======================
// CANCELAR NOTIFICACIÓN
// ======================
export async function cancelarNotificacion(id) {
  if (!id) return;

  await Notifications.cancelScheduledNotificationAsync(id);
}

// ======================
// CANCELAR TODAS (extra útil)
// ======================
export async function cancelarTodasLasNotificaciones() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
