import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import { useContext, useState } from 'react';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, HelperText, Modal, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { sendReport } from '@/app/services/report-service';
import { ReportCategory, ReportRequest } from '@/app/models/report';

interface ChangePasswordProps {
  visible: boolean;
  onDismiss: () => void;
}

const ReportBug: React.FC<ChangePasswordProps> = ({ visible, onDismiss }) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reportMessage, setReportMessage] = useState<string>('');

  const { user, isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  const handleReportBug = async () => {
    try {
      setLoading(true);
      const request: ReportRequest = {
        userId: user?.userId ?? 0,
        reportMessage: reportMessage,
        category: ReportCategory.BUG
      };

      const result = await sendReport(request);

      setSnackBarContent(
        i18n.t(result.message),
        result.success ? successColor : errorColor
      );

      if (result.success) {
        setReportMessage('');
        onDismiss();
      }
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  const reportMessageLengthError =
    reportMessage !== '' && reportMessage.length < 12;

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const isFormValid = () => {
    return reportMessage.length > 12;
  };

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.dialog,
          {
            backgroundColor:
              Colors[isThemeDark ? 'dark' : 'light'].modalContainer2,
            alignItems: 'center'
          }
        ]}
        dismissableBackButton={true}
        dismissable={false}
      >
        <TextInput
          multiline
          mode="outlined"
          numberOfLines={1}
          value={reportMessage}
          label={i18n.t('settings.reportBugLabel')}
          style={{
            width: 300,
            textAlignVertical: 'top',
            marginBottom: 10
          }}
          error={reportMessageLengthError}
          onChangeText={(reportMessage) => {
            setReportMessage(reportMessage);
          }}
        />

        <HelperText type="error" visible={reportMessageLengthError}>
          {i18n.t('settings.reportBugLength')}
        </HelperText>

        <View style={styles.buttonContainer}>
          <Button
            icon="bug"
            mode="contained"
            labelStyle={{ color: colors.surfaceVariant }}
            buttonColor={colors.secondary}
            onPress={() => {handleReportBug()}}
            disabled={!isFormValid()}
          >
            <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
              {i18n.t('settings.reportBug')}
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={[
              {
                backgroundColor: '#F77D24',
                marginTop: 12
              }
            ]}
          >
            <Text variant="bodyLarge" style={{ color: '#fff' }}>
              {i18n.t('base.close')}
            </Text>
          </Button>
        </View>
        <SpinnerOverlay
          textContent={i18n.t('base.wait')}
          textStyle={isThemeDark ? { color: '#fff' } : { color: '#303c64' }}
          animation="fade"
          visible={loading}
          overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
          customIndicator={
            <ActivityIndicator
              size="large"
              color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor}
            />
          }
        />
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        style={{ backgroundColor: snackbarColor }}
      >
        <Text
          style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}
        >
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    width: 240
  },
  dialog: {
    flex: 1,
    padding: 60
  }
});

export default ReportBug;
