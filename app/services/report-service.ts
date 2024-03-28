import i18n from '../../assets/localization/i18n';
import {
  ReportCategory,
  ReportRequest,
  ReportResponse
} from '../models/report';
import { defaultRequestHeader } from './request-header';

const API_BASE_URL = 'http://192.168.100.11:8080/report';

export const submitUserReport = async (
  request: ReportRequest
): Promise<ReportResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-report`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        userId: request.userId,
        reportMessage: request.reportMessage,
        category: request.category
      })
    });

    if (response.status === 200) {
      return {
        success: true,
        message:
          request.category === ReportCategory.BUG
            ? i18n.t('settings.reportSendSuccessfuly')
            : i18n.t('profile.forgotPasswordSendSuccesfully')
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
