import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '@/assets/localization/i18n';
import { Button, HelperText, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { updateUserEmail } from '@/app/services/user-service';
import { useContext, useState } from 'react';

interface ChangeEmailProps {
  visible: boolean;
  onDismiss: () => void;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

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

  const handleChangeEmail = async () => {
    try {
      setLoading(true);
      const result = await updateUserEmail(user!.userId, newEmail, password);
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

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = () => {
    return validateEmail(newEmail) && password.length >= 6;
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  const emailError = newEmail !== '' && !validateEmail(newEmail);
  const passwordLengthError = password !== '' && password.length < 6;

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
          onPress={handleChangeEmail}
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
  loginForm: {
    flex: 1,
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 20,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    width: 240
  },
  linkText: {
    fontWeight: 'bold'
  },
  dialog: {
    flex: 1,
    padding: 60
  }
});

export default ChangeEmail;