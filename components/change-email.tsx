import Colors, { errorColor, successColor } from '@/constants/colors';
import i18n from '@/assets/localization/i18n';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, HelperText, Modal, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext } from '@/app/context/preference-context';
import { StyleSheet, View } from 'react-native';
import { updateUserEmail } from '@/app/services/user-service';
import { useContext, useState } from 'react';

interface ChangeEmailProps {
  visible: boolean;
  onDismiss: () => void;
}

const ChangeEmail: React.FC<ChangeEmailProps> = ({ visible, onDismiss }) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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
      setSnackbarVisible(true);
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
    hasError ? colors.error : colors.secondary;

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const emailError = newEmail !== '' && !validateEmail(newEmail);

  const passwordLengthError = password !== '' && password.length < 6;

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
          label={i18n.t('profile.newEmail')}
          value={newEmail}
          onChangeText={setNewEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          error={emailError}
          textContentType="emailAddress"
          right={
            <TextInput.Icon icon="email" color={getIconColor(emailError)} />
          }
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
            mode="contained"
            onPress={handleChangeEmail}
            style={styles.button}
            disabled={!isFormValid()}
          >
            {i18n.t('profile.changeEmail')}
          </Button>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={[
              styles.button,
              {
                backgroundColor: colors.backdrop
              }
            ]}
          >
            {i18n.t('base.close')}
          </Button>
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {' '}
          {snackbarMessage}
        </Text>

        <SpinnerOverlay
          textContent={i18n.t('base.wait')}
          textStyle={
            isThemeDark
              ? {
                  color: '#fff'
                }
              : {
                  color: '#303c64'
                }
          }
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
        style={{
          backgroundColor: snackbarColor
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  loginForm: {
    flex: 1,
    alignItems: 'center'
  },
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
  linkText: {
    fontWeight: 'bold'
  },
  dialog: {
    flex: 1,
    padding: 80,
  }
});

export default ChangeEmail;
