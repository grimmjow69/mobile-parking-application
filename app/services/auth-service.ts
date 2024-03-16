import i18n from '../../assets/localization/i18n';
import { LoginUserResponse, RegisterUserResponse } from '../models/user';
import { requestHeader } from './request-header';

const API_BASE_URL = 'http://192.168.100.11:8080/auth';

export const registerUser = async (
  email: string,
  password: string
): Promise<RegisterUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (response.status === 201) {
      return {
        success: true,
        message: i18n.t('profile.registrationResponse.registrationSucess')
      };
    } else if (response.status === 409) {
      return {
        success: false,
        message: i18n.t(`profile.registrationResponse.emailAlreadyTaken`)
      };
    } else {
      return {
        success: false,
        message: i18n.t('profile.registrationResponse.registrationFailed')
      };
    }
  } catch (error) {
    return {
      success: false,
      message: i18n.t('base.error')
    };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    const data = await response.json();

    if (response.status === 200 && data.loginSuccessfull) {
      return {
        success: true,
        message: i18n.t('profile.loginResponse.loginSuccessful'),
        user: data.user
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: i18n.t('profile.loginResponse.loginFailed'),
        user: null
      };
    } else {
      return {
        success: false,
        message: i18n.t('profile.loginResponse.unexpectedError'),
        user: null
      };
    }
  } catch (error) {
    return {
      success: false,
      message: i18n.t('base.error'),
      user: null
    };
  }
};
