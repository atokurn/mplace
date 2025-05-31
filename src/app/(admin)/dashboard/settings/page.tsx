'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Upload,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Bell,
  Palette,
  Database,
  Key,
  Users,
  FileText,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    logo: string;
    favicon: string;
    timezone: string;
    language: string;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  payment: {
    stripePublicKey: string;
    stripeSecretKey: string;
    paypalClientId: string;
    paypalClientSecret: string;
    currency: string;
    taxRate: number;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    orderNotifications: boolean;
    userRegistrations: boolean;
    systemAlerts: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockSettings: SettingsData = {
      general: {
        siteName: 'PIXEL Digital Marketplace',
        siteDescription: 'Premium digital assets for creative professionals',
        siteUrl: 'https://pixel-marketplace.com',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        timezone: 'UTC',
        language: 'en'
      },
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: 'noreply@pixel-marketplace.com',
        smtpPassword: '••••••••',
        fromEmail: 'noreply@pixel-marketplace.com',
        fromName: 'PIXEL Marketplace'
      },
      payment: {
        stripePublicKey: 'pk_test_••••••••',
        stripeSecretKey: 'sk_test_••••••••',
        paypalClientId: 'AXxxx••••••••',
        paypalClientSecret: '••••••••',
        currency: 'USD',
        taxRate: 10
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireStrongPassword: true
      },
      notifications: {
        emailNotifications: true,
        orderNotifications: true,
        userRegistrations: true,
        systemAlerts: true
      },
      appearance: {
        theme: 'dark',
        primaryColor: '#00ff99',
        secondaryColor: '#0099ff',
        fontFamily: 'Inter'
      }
    };
    
    setTimeout(() => {
      setSettings(mockSettings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    // Show success message
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto">
      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your marketplace configuration</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-0"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f] sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#00ff99] text-black'
                          : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#0f0f0f] rounded-2xl p-8 border border-[#2f2f2f]">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.general.siteUrl}
                        onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSettings('general', 'language', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Email Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpPort}
                        onChange={(e) => updateSettings('email', 'smtpPort', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        SMTP Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.smtpPassword ? 'text' : 'password'}
                          value={settings.email.smtpPassword}
                          onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('smtpPassword')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.smtpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Stripe */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Stripe Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Publishable Key
                          </label>
                          <input
                            type="text"
                            value={settings.payment.stripePublicKey}
                            onChange={(e) => updateSettings('payment', 'stripePublicKey', e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Secret Key
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.stripeSecret ? 'text' : 'password'}
                              value={settings.payment.stripeSecretKey}
                              onChange={(e) => updateSettings('payment', 'stripeSecretKey', e.target.value)}
                              className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('stripeSecret')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.stripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* PayPal */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">PayPal Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Client ID
                          </label>
                          <input
                            type="text"
                            value={settings.payment.paypalClientId}
                            onChange={(e) => updateSettings('payment', 'paypalClientId', e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Client Secret
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.paypalSecret ? 'text' : 'password'}
                              value={settings.payment.paypalClientSecret}
                              onChange={(e) => updateSettings('payment', 'paypalClientSecret', e.target.value)}
                              className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('paypalSecret')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.paypalSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* General Payment Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Default Currency
                          </label>
                          <select
                            value={settings.payment.currency}
                            onChange={(e) => updateSettings('payment', 'currency', e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={settings.payment.taxRate}
                            onChange={(e) => updateSettings('payment', 'taxRate', parseFloat(e.target.value))}
                            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="1440"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                        <div>
                          <h3 className="text-white font-medium">Strong Password Required</h3>
                          <p className="text-gray-400 text-sm">Require uppercase, lowercase, numbers, and symbols</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.requireStrongPassword}
                            onChange={(e) => updateSettings('security', 'requireStrongPassword', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">Order Notifications</h3>
                        <p className="text-gray-400 text-sm">Get notified when new orders are placed</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.orderNotifications}
                          onChange={(e) => updateSettings('notifications', 'orderNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">User Registrations</h3>
                        <p className="text-gray-400 text-sm">Get notified when new users register</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.userRegistrations}
                          onChange={(e) => updateSettings('notifications', 'userRegistrations', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">System Alerts</h3>
                        <p className="text-gray-400 text-sm">Receive important system notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) => updateSettings('notifications', 'systemAlerts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff99]"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => updateSettings('appearance', 'theme', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Font Family
                      </label>
                      <select
                        value={settings.appearance.fontFamily}
                        onChange={(e) => updateSettings('appearance', 'fontFamily', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-12 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                          className="w-12 h-12 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                          className="flex-1 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;