import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Text, useTheme } from 'react-native-paper';
import ChangeEmail from './change-email';
import ChangePassword from './change-password';
import { Link } from 'expo-router';
import i18n from '@/assets/localization/i18n';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUsersAccount } from '@/app/services/user-service';
import { errorColor, successColor } from '@/constants/Colors';

interface UserContentProps {
  toggleChangeEmailModal: () => void;
  toggleChangePasswordModal: () => void;
  handleSignOut: () => void;
  isChangeEmailVisible: boolean;
  isChangePasswordVisible: boolean;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

const UserContent: React.FC<UserContentProps> = ({
  toggleChangeEmailModal,
  toggleChangePasswordModal,
  handleSignOut,
  isChangeEmailVisible,
  isChangePasswordVisible,
  setLoading: setLoading,
  setSnackBarContent,
  setSnackBarVisible
}) => {
  const { colors } = useTheme();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const { user, setUser } =
    useContext<PreferencesContextProps>(PreferencesContext);

  async function deleteAccount(userId: number) {
    try {
      if (user) {
        setLoading(true);
        const result = await deleteUsersAccount(user.userId);
        await AsyncStorage.removeItem('user');
        setUser(null);

        setSnackBarContent(
          i18n.t(result.message),
          result.success ? successColor : errorColor
        );
      }
    } catch (error) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  return (
    <View style={styles.userContent}>
      <Button
        mode="contained"
        style={styles.buttonRow}
        buttonColor={colors.secondary}
        onPress={toggleChangePasswordModal}
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
        style={styles.buttonRow}
        buttonColor={colors.secondary}
        onPress={toggleChangeEmailModal}
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
      <Link href="/my-notifications" asChild>
        <Button
          style={styles.buttonRow}
          mode="contained"
          buttonColor={colors.secondary}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: colors.surfaceVariant
            }}
          >
            {i18n.t('profile.myNotifications')}
          </Text>
        </Button>
      </Link>
      <Button
        style={styles.buttonRow}
        mode="contained"
        buttonColor={colors.error}
        onPress={() => setDialogVisible(true)}
      >
        <Text
          variant="bodyLarge"
          style={{
            color: colors.surfaceVariant
          }}
        >
          {i18n.t('profile.deleteAccount')}
        </Text>
      </Button>
      <Button
        style={styles.signOutButton}
        mode="contained"
        buttonColor={colors.secondary}
        onPress={handleSignOut}
      >
        <Text
          variant="bodyLarge"
          style={{
            color: colors.surfaceVariant
          }}
        >
          {' '}
          {i18n.t('profile.signOut')}
        </Text>
      </Button>
      <ChangeEmail
        visible={isChangeEmailVisible}
        onDismiss={toggleChangeEmailModal}
        setLoading={setLoading}
        setSnackBarContent={setSnackBarContent}
        setSnackBarVisible={setSnackBarVisible}
      />
      <ChangePassword
        visible={isChangePasswordVisible}
        onDismiss={toggleChangePasswordModal}
        setLoading={setLoading}
        setSnackBarContent={setSnackBarContent}
        setSnackBarVisible={setSnackBarVisible}
      />
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>{i18n.t('profile.deleteUserTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text>{i18n.t('profile.deleteUserContent')}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => deleteAccount(user!.userId)}>
            {i18n.t('base.confirm')}
          </Button>
          <Button onPress={() => setDialogVisible(false)}>
            {i18n.t('base.close')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  userContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60
  },
  input: {
    width: 240
  },
  signOutButton: {
    position: 'absolute',
    bottom: 48
  },
  footerView: {
    position: 'relative',
    top: 200
  },
  buttonRow: {
    marginBottom: 10,
    width: 200
  }
});

export default UserContent;