import React, { useState, useEffect, useContext } from 'react';
import { Icon, IconButton, List, Snackbar, Text } from 'react-native-paper';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { fetchUserNotifications, unsubscribeFromNotificationByNotificationId } from './services/notifications-service';
import { PreferencesContext } from './context/preference-context';
import { SpotNotification } from './models/notifications';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import i18n from '@/assets/localization/i18n';
import { errorColor, successColor } from '@/constants/colors';

export default function MyNotificationsScreen() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const [userNotifications, setUserNotifications] = useState<SpotNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { isThemeDark, user } = useContext(PreferencesContext);

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        const notificationsArray = await fetchUserNotifications(user!.userId);
        setUserNotifications(notificationsArray);
        setSnackBarContent(i18n.t('base.loadSuccess'), successColor);
      } catch (e) {
        setSnackBarContent(i18n.t('base.loadFailed'), errorColor);
      } finally {
        setSnackbarVisible(true);
        setLoading(false);
      }
    }

    loadNotifications();
  }, [user]);

  function unsubscribe(notificationId: number) {
    try {
      setLoading(true);
      unsubscribeFromNotificationByNotificationId(notificationId);
      const updatedNotifications = userNotifications.filter(
        (notification) => notification.notificationId !== notificationId
      );
      setUserNotifications(updatedNotifications);
      setSnackBarContent(i18n.t('notifications.unsubscribe'), successColor);
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  }

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const EmptyListComponent = () => (
    <View style={styles.centered}>
      <Icon source={'delete-empty'} size={72} />
      <Text style={styles.emptyText}>{i18n.t('notifications.emptyNotificationList')}</Text>
    </View>
  );

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  return (
    <View style={styles.page}>
      {loading ? (
        <SpinnerOverlay
          visible={true}
          overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
          customIndicator={
            <ActivityIndicator size="large" color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor} />
          }
        />
      ) : userNotifications.length > 0 ? (
        <List.Section>
          {userNotifications.map((notification) => (
            <List.Item
              key={notification.notificationId.toString()}
              title={`Parking Spot ${notification.parkingSpotName}`}
              left={(props) => <List.Icon {...props} icon="car" />}
              right={() => (
                <IconButton
                  icon={'delete-circle'}
                  size={28}
                  style={styles.unsubscribeButton}
                  onPress={() => unsubscribe(notification.notificationId)}
                />
              )}
              style={styles.itemDivider}
            />
          ))}
        </List.Section>
      ) : (
        <EmptyListComponent />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        style={{ backgroundColor: snackbarColor, alignItems: 'center' }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}> {snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  emptyText: {
    marginTop: 20,
    fontSize: 24
  },
  unsubscribeButton: {
    position: 'relative',
    left: 18
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c'
  }
});
