import i18n from '@/assets/localization/i18n';
import { UpdateUserResponse } from '../models/user';
import { requestHeader } from './request-header';
const API_BASE_URL = 'http://192.168.100.11:8080/user';

export const updateFavouriteSpot = async (
  userId: number,
  spotId: number | null
): Promise<UpdateUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-favourite-spot`, {
      method: 'PUT',
      headers: requestHeader,
      body: JSON.stringify({
        userId: userId,
        spotId: spotId
      })
    });

    if (!response.ok) {
      return {
        success: false,
        message: i18n.t('base.error')
      };
    } else {
      return {
        success: true,
        message: i18n.t('parkingMap.favourite.updated')
      };
    }
  } catch (error) {
    return {
      success: true,
      message: i18n.t('base.error')
    };
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
      headers: requestHeader,
      body: JSON.stringify({
        userId: userId,
        newPassword: newPassword,
        password: password
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: i18n.t('updateResponse.passwordUpdatedSucessfuly')
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: i18n.t('updateResponse.passwordVerificationFailed')
      };
    } else {
      return {
        success: false,
        message: i18n.t('base.error')
      };
    }
  } catch (error) {
    return {
      success: false,
      message: i18n.t('base.error')
    };
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
      headers: requestHeader,
      body: JSON.stringify({
        userId: userId,
        newEmail: newEmail,
        password: password
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: i18n.t('updateResponse.emailUpdatedSuccessfuly')
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: i18n.t('updateResponse.passwordVerificationFailed')
      };
    } else if (response.status === 409) {
      return {
        success: false,
        message: i18n.t('updateResponse.emailAlreadyInUse')
      };
    } else {
      return {
        success: false,
        message: i18n.t('base.error')
      };
    }
  } catch (error) {
    return {
      success: false,
      message: i18n.t('base.error')
    };
  }
};

export const deleteUsersAccount = async (
  userId: number
): Promise<UpdateUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: 'DELETE',
      headers: requestHeader,
      body: JSON.stringify({
        userId: userId
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: i18n.t('profile.accountDeletedSuccessfuly')
      };
    } else {
      return {
        success: false,
        message: i18n.t('base.error')
      };
    }
  } catch (error) {
    return {
      success: false,
      message: i18n.t('base.error')
    };
  }
};
