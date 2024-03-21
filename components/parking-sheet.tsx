import React, { useContext } from 'react';
import { Text, Button, Divider, IconButton,useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from '../assets/localization/i18n';
import { ParkingSheetContent } from '@/app/(tabs)';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';

interface ParkingSheetProps {
  sheetContent: ParkingSheetContent;
  getSheetTitle: (content: ParkingSheetContent) => string;
  getSheetText: (content: ParkingSheetContent) => string;
  handleNotificationPressed: (userId: number, spotId: number) => void;
  handleFavouriteSpotPressed: (userId: number, spotId: number) => void;
  openSpotHistory: (spotName: string, spotId: number) => void;
  isFavourite: boolean;
  notificationsEnabled: boolean;
}

const ParkingSheet: React.FC<ParkingSheetProps> = ({
  sheetContent,
  getSheetTitle,
  getSheetText,
  handleNotificationPressed,
  handleFavouriteSpotPressed,
  openSpotHistory,
  isFavourite,
  notificationsEnabled
}) => {
  const { user } = useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <View style={styles.sheetHeader}>
        <View style={styles.leftContainer}>
          <Text variant="titleMedium" style={{ color: colors.tertiary }}>
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
