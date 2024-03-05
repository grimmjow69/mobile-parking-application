import i18n from '../../assets/localization/i18n';
import { Snackbar } from 'react-native-paper';
const API_BASE_URL = 'http://192.168.100.11:8080/auth';

export const registerUser = async (
  email: string,
  password: string,
  showSnackbar: any,
  onSuccess: () => void
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      showSnackbar(i18n.t('profile.registrationResponse.registrationSucess'), '#56ae57');
      onSuccess();
    } else if (response.status === 400) {
      showSnackbar(i18n.t(`profile.registrationResponse.${data.error}`), '#D32F2F');
    } else {
      showSnackbar(i18n.t('profile.registrationResponse.registrationFailed'), '#D32F2F');
    }
  } catch (error) {
    showSnackbar(i18n.t('profile.registrationResponse.unexpectedFailed'), '#D32F2F');
  }
};
