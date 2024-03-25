import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import ChangeEmail from './change-email';
import ChangePassword from './change-password';
import { Link } from 'expo-router';
import i18n from '@/assets/localization/i18n';

interface UserContentProps {
  toggleChangeEmailModal: () => void;
  toggleChangePasswordModal: () => void;
  handleSignOut: () => void;
  isChangeEmailVisible: boolean;
  isChangePasswordVisible: boolean;
}

const UserContent: React.FC<UserContentProps> = ({
  toggleChangeEmailModal,
  toggleChangePasswordModal,
  handleSignOut,
  isChangeEmailVisible,
  isChangePasswordVisible
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.userContent}>
      <Button
        mode="contained"
        style={styles.buttonRow}
        buttonColor={colors.secondary}
        onPress={toggleChangePasswordModal}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {i18n.t('profile.changePassword')}
        </Text>
      </Button>
      <Button
        mode="contained"
        style={styles.buttonRow}
        buttonColor={colors.secondary}
        onPress={toggleChangeEmailModal}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {i18n.t('profile.changeEmail')}
        </Text>
      </Button>
      <Link href="/my-notifications" asChild>
        <Button
          style={styles.buttonRow}
          mode="contained"
          buttonColor={colors.secondary}
        >
          <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
            {i18n.t('profile.myNotifications')}
          </Text>
        </Button>
      </Link>
      <Button
        style={styles.signOutButton}
        mode="contained"
        buttonColor={colors.secondary}
        onPress={handleSignOut}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {' '}
          {i18n.t('profile.signOut')}
        </Text>
      </Button>
      <ChangeEmail
        visible={isChangeEmailVisible}
        onDismiss={toggleChangeEmailModal}
      />
      <ChangePassword
        visible={isChangePasswordVisible}
        onDismiss={toggleChangePasswordModal}
      />
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
