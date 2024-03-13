import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { SpotNotification } from '../models/notifications';

const API_BASE_URL = 'http://192.168.100.11:8080/notification';

export const sendPushTokenToServer = async (token: string, userId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        token
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending push token to server:', error);
  }
};

export const deletePushTokenFromServer = async (userId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error removing push token to server:', error);
  }
};

export const fetchUserNotifications = async (userId: number): Promise<SpotNotification[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-notifications/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse.userNotifications;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};
export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
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
      console.error('Project ID is required to get the Expo Push Token and was not found in the app manifest.');
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

export const subscribeToNotification = async (parkingSpotId: number, userId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parkingSpotId: parkingSpotId,
        userId: userId
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error subscribing to notification:', error);
  }
};

export const unsubscribeFromNotificationByNotificationId = async (notificationId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/unsubscribe/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
  }
};

export const unsubscribeFromNotificationByUserAndParkingSpotId = async (
  userId: number,
  parkingSpotId: number
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        parkingSpotId
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
  }
};
