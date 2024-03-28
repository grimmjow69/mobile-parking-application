import React, { useContext } from 'react';
import { Text, Button, Divider, IconButton, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from '../assets/localization/i18n';
import { ParkingSheetContent } from '@/app/(tabs)';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { subscribeUserToNotification, unsubscribeUserFromNotificationBySpotId } from '@/app/services/notifications-service';
import { changeFavouriteSpot } from '@/app/services/user-service';
import { errorColor, successColor } from '@/constants/Colors';
import { format } from 'date-fns';
import { ParkingSheetProps } from './component-props';

const DATE_FORMAT = 'HH:mm:ss dd.MM.yyyy';

const ParkingSheet: React.FC<ParkingSheetProps> = ({
  sheetContent,
  openSpotHistory,
  isFavourite,
  notificationsEnabled,
  setLoading,
  setNotificationsEnabled,
  setIsFavourite,
  setSnackBarContent,
  setSnackBarVisible
}) => {
  const { user } = useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  async function handleNotificationButtonPressed(
    userId: number,
    spotId: number
  ) {
    try {
      setLoading(true);
      setNotificationsEnabled(!notificationsEnabled);

      if (notificationsEnabled) {
        await unsubscribeUserFromNotificationBySpotId(userId, spotId);
        setSnackBarContent(i18n.t('notifications.unsubscribe'), successColor);
      } else {
        await subscribeUserToNotification(spotId, userId);
        setSnackBarContent(i18n.t('notifications.subscribe'), successColor);
      }
    } catch (error) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  async function handleFavouriteSpotButtonPressed(
    userId: number,
    spotId: number
  ) {
    try {
      setIsFavourite(!isFavourite);
      setLoading(true);
      const result = await changeFavouriteSpot(
        userId,
        isFavourite ? null : spotId
      );
      setSnackBarContent(
        result.message,
        result.success ? successColor : errorColor
      );
    } catch (error) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  function generateSheetTitle(sheetContent: ParkingSheetContent) {
    let state = '';
    if (sheetContent?.occupied !== null) {
      state = sheetContent?.occupied
        ? i18n.t('parkingMap.parkingSpotDetail.header.stateOccupied')
        : i18n.t('parkingMap.parkingSpotDetail.header.stateFree');
    } else {
      state = i18n.t('parkingMap.parkingSpotDetail.header.stateUnknown');
    }

    return `${sheetContent?.spotName} - ${state}`;
  }

  function generateSheetText(sheetContent: ParkingSheetContent) {
    let state = '';
    if (sheetContent?.occupied !== null) {
      state = sheetContent?.occupied
        ? i18n.t('parkingMap.parkingSheet.occupiedSince')
        : i18n.t('parkingMap.parkingSheet.freeSince');
    } else {
      return i18n.t('parkingMap.parkingSheet.stateUnknown');
    }

    let sinceDate = '';

    if (sheetContent.sheetData.stateSince === null) {
      sinceDate = i18n.t('parkingMap.parkingSheet.noData');
    } else {
      sinceDate = format(sheetContent.sheetData.stateSince, DATE_FORMAT);
    }
    return `${state}: ${sinceDate}`;
  }

  return (
    <React.Fragment>
      <View
        style={[
          styles.sheetHeader,
          user
            ? {
                marginBottom: 6
              }
            : {
                marginBottom: 20
              }
        ]}
      >
        <View style={styles.leftContainer}>
          <Text
            variant="titleMedium"
            style={{
              color: colors.tertiary
            }}
          >
            {generateSheetTitle(sheetContent)}
          </Text>
        </View>
        {user && (
          <View style={styles.rightContainer}>
            <IconButton
              icon={notificationsEnabled ? 'bell' : 'bell-outline'}
              size={30}
              onPress={() =>
                handleNotificationButtonPressed(
                  user.userId,
                  sheetContent.spotId
                )
              }
            />
            <IconButton
              icon={isFavourite ? 'star' : 'star-outline'}
              size={30}
              onPress={() =>
                handleFavouriteSpotButtonPressed(
                  user.userId,
                  sheetContent.spotId
                )
              }
            />
          </View>
        )}
      </View>
      <Divider />
      <View style={styles.sheetBody}>
        <Text variant="bodyLarge">{generateSheetText(sheetContent)}</Text>
      </View>
      <View style={styles.sheetFooter}>
        <Button
          mode="contained"
          style={styles.closeSheetButton}
          onPress={() =>
            openSpotHistory(sheetContent.spotName, sheetContent.spotId)
          }
        >
          {i18n.t('parkingMap.showHistory')}
        </Button>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  leftContainer: {
    flex: 1
  },
  rightContainer: {
    flexDirection: 'row'
  },
  sheetFooter: {
    alignItems: 'center'
  },
  sheetBody: {
    marginTop: 40,
    alignItems: 'center'
  },
  closeSheetButton: {
    marginTop: 20
  }
});

export default ParkingSheet;
