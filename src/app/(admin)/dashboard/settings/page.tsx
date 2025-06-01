"use client"

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  CreditCard,
  Database,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile settings
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Admin user managing the marketplace platform.',
    avatar: '/api/placeholder/100/100'
  });

  // Password settings
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  });

  // Security settings
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  // Appearance settings
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    // API call would go here
    setLoading(false);
    // Show success message
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    // API call would go here
    setLoading(false);
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // Show success message
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean | string) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handleAppearanceChange = (key: keyof AppearanceSettings, value: string) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' }
  ];

  const timezones = [
    { value: 'UTC-12', label: '(UTC-12:00) International Date Line West' },
    { value: 'UTC-8', label: '(UTC-08:00) Pacific Time' },
    { value: 'UTC-5', label: '(UTC-05:00) Eastern Time' },
    { value: 'UTC+0', label: '(UTC+00:00) Greenwich Mean Time' },
    { value: 'UTC+1', label: '(UTC+01:00) Central European Time' },
    { value: 'UTC+8', label: '(UTC+08:00) China Standard Time' }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account and application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-[#1a1a1a] border-[#2f2f2f]">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#2f2f2f] text-gray-400 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#2f2f2f] text-gray-400 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#2f2f2f] text-gray-400 data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-[#2f2f2f] text-gray-400 data-[state=active]:text-white">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-[#2f2f2f] text-gray-400 data-[state=active]:text-white">
            <Database className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} alt="Profile" />
                  <AvatarFallback className="bg-[#2f2f2f] text-white text-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <p className="text-xs text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator className="bg-[#2f2f2f]" />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-[#0f0f0f] border-[#2f2f2f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-[#0f0f0f] border-[#2f2f2f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0f0f0f] border-[#2f2f2f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-[#0f0f0f] border-[#2f2f2f] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-[#0f0f0f] border-[#2f2f2f] text-white min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-[#00ff99] text-black hover:bg-[#00cc77]"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="bg-[#0f0f0f] border-[#2f2f2f] text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="bg-[#0f0f0f] border-[#2f2f2f] text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-[#0f0f0f] border-[#2f2f2f] text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword}
                  disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                  className="bg-[#00ff99] text-black hover:bg-[#00cc77]"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure security features to protect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                    {security.twoFactorAuth && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Enabled
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator className="bg-[#2f2f2f]" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Login Alerts</Label>
                    <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
                  />
                </div>

                <Separator className="bg-[#2f2f2f]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Session Timeout (minutes)</Label>
                    <Select value={security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                      <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                        <SelectItem value="15" className="text-white hover:bg-[#2f2f2f]">15 minutes</SelectItem>
                        <SelectItem value="30" className="text-white hover:bg-[#2f2f2f]">30 minutes</SelectItem>
                        <SelectItem value="60" className="text-white hover:bg-[#2f2f2f]">1 hour</SelectItem>
                        <SelectItem value="120" className="text-white hover:bg-[#2f2f2f]">2 hours</SelectItem>
                        <SelectItem value="480" className="text-white hover:bg-[#2f2f2f]">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Password Expiry (days)</Label>
                    <Select value={security.passwordExpiry} onValueChange={(value) => handleSecurityChange('passwordExpiry', value)}>
                      <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                        <SelectItem value="30" className="text-white hover:bg-[#2f2f2f]">30 days</SelectItem>
                        <SelectItem value="60" className="text-white hover:bg-[#2f2f2f]">60 days</SelectItem>
                        <SelectItem value="90" className="text-white hover:bg-[#2f2f2f]">90 days</SelectItem>
                        <SelectItem value="180" className="text-white hover:bg-[#2f2f2f]">180 days</SelectItem>
                        <SelectItem value="365" className="text-white hover:bg-[#2f2f2f]">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-[#2f2f2f]">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Current Session</p>
                      <p className="text-sm text-gray-400">MacBook Pro • Chrome • New York, NY</p>
                      <p className="text-xs text-gray-500">Last active: Now</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Current
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-[#2f2f2f]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Mobile Session</p>
                      <p className="text-sm text-gray-400">iPhone • Safari • New York, NY</p>
                      <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#2f2f2f] text-gray-400 hover:text-white">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <Separator className="bg-[#2f2f2f]" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>

                <Separator className="bg-[#2f2f2f]" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-400">Receive notifications via text message</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>

                <Separator className="bg-[#2f2f2f]" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Order Updates</Label>
                      <p className="text-sm text-gray-400">New orders, status changes, and cancellations</p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Marketing Emails</Label>
                      <p className="text-sm text-gray-400">Product updates, newsletters, and promotions</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Security Alerts</Label>
                      <p className="text-sm text-gray-400">Login attempts, password changes, and security events</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <Select value={appearance.theme} onValueChange={(value) => handleAppearanceChange('theme', value)}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                      <SelectItem value="dark" className="text-white hover:bg-[#2f2f2f]">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="light" className="text-white hover:bg-[#2f2f2f]">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-[#2f2f2f]">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Language</Label>
                  <Select value={appearance.language} onValueChange={(value) => handleAppearanceChange('language', value)}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-[#2f2f2f]">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Timezone</Label>
                  <Select value={appearance.timezone} onValueChange={(value) => handleAppearanceChange('timezone', value)}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value} className="text-white hover:bg-[#2f2f2f]">
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Date Format</Label>
                  <Select value={appearance.dateFormat} onValueChange={(value) => handleAppearanceChange('dateFormat', value)}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                      <SelectItem value="MM/DD/YYYY" className="text-white hover:bg-[#2f2f2f]">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY" className="text-white hover:bg-[#2f2f2f]">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD" className="text-white hover:bg-[#2f2f2f]">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD MMM YYYY" className="text-white hover:bg-[#2f2f2f]">DD MMM YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white">Currency</Label>
                  <Select value={appearance.currency} onValueChange={(value) => handleAppearanceChange('currency', value)}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2f2f2f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value} className="text-white hover:bg-[#2f2f2f]">
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                View system details and manage data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version</span>
                    <span className="text-white">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database Size</span>
                    <span className="text-white">2.4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Storage Used</span>
                    <span className="text-white">15.2 GB / 100 GB</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Users</span>
                    <span className="text-white">8,945</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Products</span>
                    <span className="text-white">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Orders</span>
                    <span className="text-white">5,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-white">99.9%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Export, import, and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;