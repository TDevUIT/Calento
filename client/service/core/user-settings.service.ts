import { api, getErrorMessage } from '../../config/axios';
import { ApiSuccessResponse } from '../../interface/auth.interface';
import { UserSettings } from '../../store/user-settings.store';

interface UpdateUserSettingsRequest {
  settings: Partial<UserSettings>;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const response = await api.get<ApiSuccessResponse<UserSettings>>(
      '/users/settings',
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUserSettings = async (
  settings: Partial<UserSettings>
): Promise<UserSettings> => {
  try {
    const response = await api.patch<ApiSuccessResponse<UserSettings>>(
      '/users/settings',
      { settings },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  try {
    await api.post(
      '/users/change-password',
      data,
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteAccount = async (): Promise<void> => {
  try {
    await api.delete('/users/account', { withCredentials: true });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const userSettingsService = {
  getUserSettings,
  updateUserSettings,
  changePassword,
  deleteAccount,
};

export default userSettingsService;

