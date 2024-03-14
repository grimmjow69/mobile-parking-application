import Colors, { errorColor, successColor } from '@/constants/colors';
import i18n from '@/assets/localization/i18n';
import { useContext, useState } from 'react';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, HelperText, Modal, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { updateUserPassword } from '@/app/services/user-service';

interface ChangePasswordProps {
  visible: boolean;
  onDismiss: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  visible,
  onDismiss
}) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const { user, isThemeDark } = useContext(PreferencesContext);
  const { colors } = useTheme();

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const result = await updateUserPassword(
        user!.userId,
        newPassword,
        currentPassword
      );
      setSnackBarContent(
        i18n.t(`profile.${result.message}`),
        result.success ? successColor : errorColor
      );
      if (result.success) {
        onDismiss();
      }
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const passwordsMatchError =
    newPassword !== '' &&
    confirmNewPassword !== '' &&
    newPassword !== confirmNewPassword;

  const passwordLengthError =
    currentPassword !== '' && currentPassword.length < 6;

  const newPasswordLengthError = newPassword !== '' && newPassword.length < 6;

  const isFormValid = () => {
    return (
      newPassword === confirmNewPassword &&
      currentPassword.length >= 6 &&
      newPassword.length >= 6
    );
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.secondary;

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.dialog,
          {
            backgroundColor:
              Colors[isThemeDark ? 'dark' : 'light'].modalContainer
          }
        ]}
        dismissableBackButton={true}
        dismissable={false}
      >
        <TextInput
          label={i18n.t('profile.currentPassword')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          mode="outlined"
          secureTextEntry
          error={passwordLengthError}
          textContentType="password"
          right={
            <TextInput.Icon
              icon="lock"
              color={getIconColor(passwordLengthError)}
            />
          }
        />

        <HelperText type="error" visible={passwordLengthError}>
          {i18n.t('profile.errors.passwordLengthError')}
        </HelperText>

        <TextInput
          label={i18n.t('profile.newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          secureTextEntry
          error={newPasswordLengthError}
          textContentType="newPassword"
          right={
            <TextInput.Icon
              icon="lock"
              color={getIconColor(passwordLengthError)}
            />
          }
        />
        <HelperText type="error" visible={newPasswordLengthError}>
          {i18n.t('profile.errors.passwordLengthError')}
        </HelperText>

        <TextInput
          label={i18n.t('profile.confirmPassword')}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          mode="outlined"
          error={passwordsMatchError}
          secureTextEntry
          right={
            <TextInput.Icon
              icon="lock"
              color={getIconColor(passwordLengthError)}
            />
          }
        />
        
        <HelperText type="error" visible={passwordsMatchError}>
          {i18n.t('profile.errors.passwordsMatchError')}
        </HelperText>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.button}
            disabled={!isFormValid()}
          >
            {i18n.t('profile.changePassword')}
          </Button>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={[styles.button, { backgroundColor: colors.backdrop }]}
          >
            {i18n.t('base.close')}
          </Button>
        </View>
        <Text
          style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}
        >
          {' '}
          {snackbarMessage}
        </Text>

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
        duration={Snackbar.DURATION_SHORT}
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
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    flex: 1,
    margin: 8
  },
  input: {
    width: 240
  },
  dialog: {
    flex: 1,
    padding: 30
  }
});

export default ChangePassword;
