import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import { useContext, useState } from 'react';
import { Button, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { changeUserPassword } from '@/app/services/user-service';
import { ChangePasswordProps } from './component-props';
import { Keyboard } from 'react-native';

const MIN_PASSWORD_LENGTH = 6;

const ChangePassword: React.FC<ChangePasswordProps> = ({
  visible,
  onDismiss,
  setLoading,
  setSnackBarContent,
  setSnackBarVisible
}) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const { user, isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      const result = await changeUserPassword(
        user!.userId,
        newPassword,
        currentPassword
      );
      setSnackBarContent(
        i18n.t(`profile.${result.message}`),
        result.success ? successColor : errorColor
      );

      if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        Keyboard.dismiss();
        onDismiss();
      }
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackBarVisible(true);
      setLoading(false);
    }
  };

  const passwordsMatchError =
    newPassword !== '' &&
    confirmNewPassword !== '' &&
    newPassword !== confirmNewPassword;
  const passwordLengthError =
    currentPassword !== '' && currentPassword.length < MIN_PASSWORD_LENGTH;
  const newPasswordLengthError =
    newPassword !== '' && newPassword.length < MIN_PASSWORD_LENGTH;

  const isPasswordFormValid = () => {
    return (
      newPassword === confirmNewPassword &&
      currentPassword.length >= MIN_PASSWORD_LENGTH &&
      newPassword.length >= MIN_PASSWORD_LENGTH
    );
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[
        styles.dialog,
        {
          backgroundColor:
            Colors[isThemeDark ? 'dark' : 'light'].modalContainer2
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
          icon="key-change"
          mode="contained"
          labelStyle={{
            color: colors.surfaceVariant
          }}
          buttonColor={colors.secondary}
          onPress={handlePasswordChange}
          disabled={!isPasswordFormValid()}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: colors.surfaceVariant
            }}
          >
            {i18n.t('profile.changePassword')}
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
          <Text
            variant="bodyLarge"
            style={{
              color: '#fff'
            }}
          >
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
  dialog: {
    flex: 1,
    padding: 60
  }
});

export default ChangePassword;