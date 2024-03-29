import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

async function registerForPushNotification() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

  if (status !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      return
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export { registerForPushNotification }