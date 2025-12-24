'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUserSettingsStore } from '@/store/user-settings.store';
import {
  useUserSettings,
  useUpdateUserSettings,
  useChangePassword,
  useDeleteAccount,
} from '@/hook/user/use-user-settings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Loader2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const settings = useUserSettingsStore();
  const { data: serverSettings, isLoading: isLoadingSettings } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const [activeTab, setActiveTab] = useState('account');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (serverSettings) {
      settings.setSettings(serverSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSettings]);

  const handleSaveAccountSettings = async () => {
    await updateSettingsMutation.mutateAsync({
      language: settings.language,
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,
    });
  };

  const handleSaveNotificationSettings = async () => {
    await updateSettingsMutation.mutateAsync({
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      eventReminders: settings.eventReminders,
      weeklyDigest: settings.weeklyDigest,
      newFeatures: settings.newFeatures,
      marketingEmails: settings.marketingEmails,
    });
  };

  const handleSaveSecuritySettings = async () => {
    await updateSettingsMutation.mutateAsync({
      twoFactorAuth: settings.twoFactorAuth,
      sessionTimeout: settings.sessionTimeout,
      loginAlerts: settings.loginAlerts,
    });
  };

  const handleSaveAppearanceSettings = async () => {
    await updateSettingsMutation.mutateAsync({
      theme: settings.theme,
      compactMode: settings.compactMode,
      showWeekNumbers: settings.showWeekNumbers,
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await changePasswordMutation.mutateAsync({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      await deleteAccountMutation.mutateAsync();
    }
  };

  if (isLoading || isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-2 border-black dark:border-white rounded-lg p-2 mb-6 bg-muted/30">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-transparent gap-2">
              <TabsTrigger 
                value="account" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Appearance</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Configure your language, timezone, and date/time formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => settings.updateSetting('language', value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => settings.updateSetting('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</SelectItem>
                        <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) => settings.updateSetting('dateFormat', value)}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select
                      value={settings.timeFormat}
                      onValueChange={(value) => settings.updateSetting('timeFormat', value)}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                        <SelectItem value="24h">24-hour (14:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAccountSettings}
                    disabled={updateSettingsMutation.isPending}
                    className="gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account details and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    {user?.is_verified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">Username</p>
                      <p className="text-sm text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('emailNotifications', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications" className="text-base font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get push notifications on your devices
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('pushNotifications', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="event-reminders" className="text-base font-medium">
                        Event Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders before your scheduled events
                      </p>
                    </div>
                    <Switch
                      id="event-reminders"
                      checked={settings.eventReminders}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('eventReminders', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest" className="text-base font-medium">
                        Weekly Digest
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get a weekly summary of your calendar and tasks
                      </p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('weeklyDigest', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-features" className="text-base font-medium">
                        New Features
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Be the first to know about new features and updates
                      </p>
                    </div>
                    <Switch
                      id="new-features"
                      checked={settings.newFeatures}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('newFeatures', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails" className="text-base font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional content and tips
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('marketingEmails', checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNotificationSettings}
                    disabled={updateSettingsMutation.isPending}
                    className="gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your security preferences and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor" className="text-base font-medium">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('twoFactorAuth', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) =>
                        settings.updateSetting('sessionTimeout', value)
                      }
                    >
                      <SelectTrigger id="session-timeout">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="login-alerts" className="text-base font-medium">
                        Login Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new login attempts to your account
                      </p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={settings.loginAlerts}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('loginAlerts', checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveSecuritySettings}
                    disabled={updateSettingsMutation.isPending}
                    className="gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                    className="gap-2"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-600 dark:border-red-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                  >
                    {deleteAccountMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => settings.updateSetting('theme', value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode" className="text-base font-medium">
                        Compact Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing for a more condensed layout
                      </p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={settings.compactMode}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('compactMode', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="week-numbers" className="text-base font-medium">
                        Show Week Numbers
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display week numbers in calendar views
                      </p>
                    </div>
                    <Switch
                      id="week-numbers"
                      checked={settings.showWeekNumbers}
                      onCheckedChange={(checked) =>
                        settings.updateSetting('showWeekNumbers', checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAppearanceSettings}
                    disabled={updateSettingsMutation.isPending}
                    className="gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
