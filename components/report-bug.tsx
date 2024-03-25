import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import { Button, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { ReportCategory, ReportRequest } from '@/app/models/report';
import { sendReport } from '@/app/services/report-service';
import { StyleSheet, View } from 'react-native';
import { useContext, useState } from 'react';

interface ChangePasswordProps {
  visible: boolean;
  onDismiss: () => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setLoading: (loading: boolean) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

const ReportBug: React.FC<ChangePasswordProps> = ({
  visible,
  onDismiss,
  setSnackBarContent,
  setLoading,
  setSnackBarVisible
}) => {
  const [reportMessage, setReportMessage] = useState<string>('');

  const { user, isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  async function handleReportBug() {
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
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  const reportMessageLengthError =
    reportMessage !== '' && reportMessage.length < 12;

  const isFormValid = () => {
    return reportMessage.length > 12;
  };

  return (
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
          onPress={() => {
            handleReportBug();
          }}
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
    </Modal>
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
