import React, { useContext } from 'react';
import { Text, Button, Divider, IconButton, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from '../assets/localization/i18n';
import { ParkingSheetContent } from '@/app/(tabs)';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { subscribeToNotification, unsubscribeFromNotificationByUserAndParkingSpotId } from '@/app/services/notifications-service';
import { updateFavouriteSpot } from '@/app/services/user-service';
import { errorColor, successColor } from '@/constants/Colors';
import { format } from 'date-fns';

interface ParkingSheetProps {
  sheetContent: ParkingSheetContent;
  openSpotHistory: (spotName: string, spotId: number) => void;
  isFavourite: boolean;
  notificationsEnabled: boolean;
  setLoading: (loading: boolean) => void;
  setNotificationsEnabled: (enable: boolean) => void;
  setIsFavourite: (favourite: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

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

  async function handleNotificationPressed(userId: number, spotId: number) {
    try {
      setLoading(true);
      setNotificationsEnabled(!notificationsEnabled);

      if (notificationsEnabled) {
        await unsubscribeFromNotificationByUserAndParkingSpotId(userId, spotId);
        setSnackBarContent(i18n.t('notifications.unsubscribe'), successColor);
      } else {
        await subscribeToNotification(spotId, userId);
        setSnackBarContent(i18n.t('notifications.subscribe'), successColor);
      }
    } catch (error) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  async function handleFavouriteSpotPressed(userId: number, spotId: number) {
    try {
      setIsFavourite(!isFavourite);
      setLoading(true);
      const result = await updateFavouriteSpot(
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

  function getSheetTitle(sheetContent: ParkingSheetContent) {
    var state = '';
    if (sheetContent?.occupied !== null) {
      state = sheetContent?.occupied
        ? i18n.t('parkingMap.parkingSpotDetail.header.stateOccupied')
        : i18n.t('parkingMap.parkingSpotDetail.header.stateFree');
    } else {
      state = i18n.t('parkingMap.parkingSpotDetail.header.stateUnknown');
    }

    return `${sheetContent?.spotName} - ${state}`;
  }

  function getSheetText(sheetContent: ParkingSheetContent) {
    var state = '';
    if (sheetContent?.occupied !== null) {
      state = sheetContent?.occupied
        ? i18n.t('parkingMap.parkingSheet.occupiedSince')
        : i18n.t('parkingMap.parkingSheet.freeSince');
    } else {
      return i18n.t('parkingMap.parkingSheet.stateUnknown');
    }

    var sinceDate = '';

    if (sheetContent.sheetData.stateSince === null) {
      sinceDate = i18n.t('parkingMap.parkingSheet.noData');
    } else {
      sinceDate = format(
        sheetContent.sheetData.stateSince,
        'HH:mm:ss dd.MM.yyyy'
      );
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
            {getSheetTitle(sheetContent)}
          </Text>
        </View>
        {user && (
          <View style={styles.rightContainer}>
            <IconButton
              icon={notificationsEnabled ? 'bell' : 'bell-outline'}
              size={30}
              onPress={() =>
                handleNotificationPressed(user.userId, sheetContent.spotId)
              }
            />
            <IconButton
              icon={isFavourite ? 'star' : 'star-outline'}
              size={30}
              onPress={() =>
                handleFavouriteSpotPressed(user.userId, sheetContent.spotId)
              }
            />
          </View>
        )}
      </View>
      <Divider />
      <View style={styles.sheetBody}>
        <Text variant="bodyLarge">{getSheetText(sheetContent)}</Text>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  updatedAtTitle: {
    position: 'absolute',
    top: 10,
    padding: 11,
    borderRadius: 20
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
  },
  modalScrollContent: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  }
});

export default ParkingSheet;
