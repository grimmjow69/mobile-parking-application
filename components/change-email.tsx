import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import { Button, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { changeUserEmail } from '@/app/services/user-service';
import { useContext, useState } from 'react';
import { ChangeEmailProps } from './component-props';


const ChangeEmail: React.FC<ChangeEmailProps> = ({
  visible,
  onDismiss,
  setLoading,
  setSnackBarContent,
  setSnackBarVisible
}) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user, isThemeDark } = useContext(PreferencesContext);
  const { colors } = useTheme();

  const EMAIL_REGEX = /\S+@\S+\.\S+/;
  const MIN_PASSWORD_LENGTH = 6;

  const handleEmailChange = async () => {
    try {
      setLoading(true);
      const result = await changeUserEmail(user!.userId, newEmail, password);
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
      setSnackBarVisible(true);
      setLoading(false);
    }
  };

  const isEmailValid = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  const isFormValid = () => {
    return isEmailValid(newEmail) && password.length >= MIN_PASSWORD_LENGTH;
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  const emailError = newEmail !== '' && !isEmailValid(newEmail);
  const passwordLengthError =
    password !== '' && password.length < MIN_PASSWORD_LENGTH;

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
        label={i18n.t('profile.newEmail')}
        value={newEmail}
        onChangeText={setNewEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        error={emailError}
        textContentType="emailAddress"
        right={<TextInput.Icon icon="email" color={getIconColor(emailError)} />}
      />

      <HelperText type="error" visible={emailError}>
        {i18n.t('profile.errors.emailError')}
      </HelperText>

      <TextInput
        label={i18n.t('profile.currentPassword')}
        value={password}
        onChangeText={setPassword}
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

      <View style={styles.buttonContainer}>
        <Button
          icon="email-sync-outline"
          mode="contained"
          labelStyle={{
            color: colors.surfaceVariant
          }}
          buttonColor={colors.secondary}
          onPress={handleEmailChange}
          disabled={!isFormValid()}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: colors.surfaceVariant
            }}
          >
            {i18n.t('profile.changeEmail')}
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

export default ChangeEmail;