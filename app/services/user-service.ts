import i18n from '@/assets/localization/i18n';

const API_BASE_URL = 'http://192.168.100.11:8080/user';

export interface UpdateUserResponse {
  success: boolean;
  message: string;
}

export const updateFavouriteSpot = async (userId: number, spotId: number | null): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-favourite-spot`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        spotId: spotId
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updateing favourite spot:', error);
  }
};

export const updateUserPassword = async (
  userId: number,
  newPassword: string,
  password: string
): Promise<UpdateUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        newPassword: newPassword,
        password: password
      })
    });

    if (response.ok) {
      return { success: true, message: i18n.t('updateResponse.passwordUpdatedSucessfuly') };
    } else if (response.status === 401) {
      return { success: false, message: i18n.t('updateResponse.passwordVerificationFailed') };
    } else {
      return { success: false, message: i18n.t('base.error') };
    }
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const updateUserEmail = async (
  userId: number,
  newEmail: string,
  password: string
): Promise<UpdateUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        newEmail: newEmail,
        password: password
      })
    });

    if (response.ok) {
      return { success: true, message: i18n.t('updateResponse.emailUpdatedSuccessfuly') };
    } else if (response.status === 401) {
      return { success: false, message: i18n.t('updateResponse.passwordVerificationFailed') };
    } else if (response.status === 409) {
      return { success: false, message: i18n.t('updateResponse.emailAlreadyInUse') };
    } else {
      return { success: false, message: i18n.t('base.error') };
    }
  } catch (error) {
    return { success: false, message: 'base.error' };
  }
};
