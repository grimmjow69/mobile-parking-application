import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { SpotNotification } from '../models/notifications';
import { defaultRequestHeader } from './request-header';

const API_BASE_URL = 'http://192.168.100.11:8080/notification';

export const registerPushToken = async (
  token: string,
  userId: number
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/register-push-token`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        userId: userId,
        token: token
      })
    });
  } catch (error) {}
};

export const removePushToken = async (userId: number): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/delete-push-token`, {
      method: 'DELETE',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        userId: userId
      })
    });
  } catch (error) {}
};

export const getUserNotifications = async (
  userId: number
): Promise<SpotNotification[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user-notifications/${userId}`,
      {
        method: 'GET',
        headers: defaultRequestHeader
      }
    );
    const jsonResponse = await response.json();
    return jsonResponse.userNotifications;
  } catch (error) {
    throw error;
  }
};

export async function getPushNotificationsToken() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const projectId = Constants.manifest2?.extra?.eas?.projectId;
    if (!projectId) {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  return token;
}

export const subscribeUserToNotification = async (
  parkingSpotId: number,
  userId: number
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/subscribe-notification`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        parkingSpotId: parkingSpotId,
        userId: userId
      })
    });
  } catch (error) {}
};

export const unsubscribeUserFromNotificationById = async (
  notificationId: number
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/unsubscribe/${notificationId}`, {
      method: 'DELETE',
      headers: defaultRequestHeader
    });
  } catch (error) {}
};

export const unsubscribeUserFromNotificationBySpotId = async (
  userId: number,
  parkingSpotId: number
): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/unsubscribe`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        userId: userId,
        parkingSpotId: parkingSpotId
      })
    });
  } catch (error) {}
};
