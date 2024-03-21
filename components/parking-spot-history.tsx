import Colors from '@/constants/Colors';
import i18n from '../assets/localization/i18n';
import React, { useContext } from 'react';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import { format } from 'date-fns/format';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ModalContent } from '@/app/(tabs)';

interface ParkingSpotHistoryProps {
  modalContent: ModalContent | null;
  setModalVisible: (visible: boolean) => void;
}

const ParkingSpotHistory: React.FC<ParkingSpotHistoryProps> = ({
  modalContent,
  setModalVisible
}) => {
  const { isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <View
        style={[
          styles.historyHeaderRow,
          {
            backgroundColor:
              Colors[isThemeDark ? 'dark' : 'light'].modalContainerTableHeader
          }
        ]}
      >
        <View style={styles.historyHeaderColumn}>
          <Text
            variant="titleMedium"
            style={{ color: colors.tertiary, marginLeft: 20 }}
          >
            {i18n.t('parkingMap.parkingSpotDetail.table.stateColumnName')}
          </Text>
        </View>
        <View style={styles.historyHeaderColumn}>
          <Text variant="titleMedium" style={{ color: colors.tertiary }}>
            {i18n.t('parkingMap.parkingSpotDetail.table.updatedAtColumnName')}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.modalScrollContent}>
        {modalContent?.history?.map((historyItem, index) => (
          <View key={index} style={styles.historyRow}>
            <View style={styles.historyColumn}>
              <Text
                variant="bodyMedium"
                style={{ color: colors.tertiary, marginLeft: 20 }}
              >
                {historyItem.occupied
                  ? i18n.t('parkingMap.parkingSpotDetail.table.stateOccupied')
                  : i18n.t('parkingMap.parkingSpotDetail.table.stateFree')}
              </Text>
            </View>
            <View style={styles.historyColumn}>
              <Text style={{ color: colors.tertiary }}>
                {format(historyItem.updatedAt, 'HH:mm:ss dd.MM.yyyy')}
              </Text>
            </View>
            <Divider />
          </View>
        ))}
      </ScrollView>
      <View style={styles.modalFooter}>
        <Button
          mode="contained"
          style={styles.closeModalButton}
          onPress={() => setModalVisible(false)}
        >
          {i18n.t('base.close')}
        </Button>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalFooter: {
    alignItems: 'center'
  },
  closeModalButton: {
    marginBottom: 8
  },
  modalScrollContent: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  historyHeaderColumn: {
    flex: 1,
    paddingHorizontal: 8
  },
  historyColumn: {
    flex: 1,
    paddingHorizontal: 8
  }
});

export default ParkingSpotHistory;
