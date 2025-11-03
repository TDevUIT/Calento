import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userSettingsService } from '@/service/user-settings.service';
import { useUserSettingsStore, UserSettings } from '@/store/user-settings.store';

const QUERY_KEY = 'userSettings';

export const useUserSettings = () => {
  const setSettings = useUserSettingsStore((state) => state.setSettings);

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const settings = await userSettingsService.getUserSettings();
      setSettings(settings);
      return settings;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  const updateSettings = useUserSettingsStore((state) => state.updateSettings);

  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) =>
      userSettingsService.updateUserSettings(settings),
    onSuccess: (data) => {
      updateSettings(data);
      queryClient.setQueryData([QUERY_KEY], data);
      toast.success('Settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userSettingsService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => userSettingsService.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
};
