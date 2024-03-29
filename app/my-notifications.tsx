import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, Dialog, Icon, List, Snackbar, Text } from 'react-native-paper';
import { getUserNotifications, unsubscribeUserFromNotificationById } from './services/notifications-service';
import { PreferencesContext, PreferencesContextProps } from './context/preference-context';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SpotNotification } from './models/notifications';
import { useContext, useEffect, useState } from 'react';

export default function MyNotificationsScreen() {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [userNotifications, setUserNotifications] = useState<
    SpotNotification[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isThemeDark, user } =
    useContext<PreferencesContextProps>(PreferencesContext);

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        const notificationsArray = await getUserNotifications(user!.userId);
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

  function removeSubscription(notificationId: number) {
    try {
      setDialogVisible(false);
      setLoading(true);
      unsubscribeUserFromNotificationById(notificationId);
      const updatedNotifications = userNotifications.filter(
        (notification) => notification.notificationId !== notificationId
      );
      setUserNotifications(updatedNotifications);
      setSnackBarContent(
        i18n.t('notifications.removeSubscription'),
        successColor
      );
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  }

  const dismissSnackBar = () => setSnackbarVisible(false);

  const NoNotificationsComponent = () => (
    <View style={styles.centered}>
      <Icon source={'delete-empty'} size={72} />
      <Text style={styles.emptyText}>
        {i18n.t('notifications.emptyNotificationList')}
      </Text>
    </View>
  );

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  function removeNotificationRecord(notificationId: number) {
    setNotificationId(notificationId);
    setDialogVisible(true);
  }

  return (
    <SafeAreaProvider style={styles.container}>
      {loading ? (
        <SpinnerOverlay
          textContent={i18n.t('base.wait')}
          textStyle={
            isThemeDark
              ? {
                  color: '#fff'
                }
              : {
                  color: '#303c64'
                }
          }
          animation="fade"
          visible={true}
          overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
          customIndicator={
            <ActivityIndicator
              size="large"
              color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor}
            />
          }
        />
      ) : userNotifications.length > 0 ? (
        <List.Section>
          {userNotifications.map((notification) => (
            <List.Item
              key={notification.notificationId.toString()}
              title={`${i18n.t('notifications.parkingSpot')}: ${
                notification.parkingSpotName
              }`}
              left={(props) => <List.Icon {...props} icon="car" />}
              right={() => (
                <Pressable
                  onPress={() =>
                    removeNotificationRecord(notification.notificationId)
                  }
                >
                  <Icon source="delete-circle" color="#FF5733" size={32} />
                </Pressable>
              )}
              style={styles.itemDivider}
            />
          ))}
        </List.Section>
      ) : (
        <NoNotificationsComponent />
      )}

      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>{i18n.t('notifications.unsubscribeTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text>{i18n.t('notifications.unsubscribeContent')}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => removeSubscription(notificationId!)}>
            {i18n.t('base.confirm')}
          </Button>
          <Button onPress={() => setDialogVisible(false)}>
            {i18n.t('base.close')}
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackBar}
        duration={1000}
        style={{
          backgroundColor: snackbarColor,
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
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
