/**
 * Eternum Trading Journal - Settings and Preferences System
 * Comprehensive user settings management with privacy controls
 */

class SettingsSystem {
  constructor() {
    this.settings = this.getDefaultSettings();
    this.preferences = new Map();
    this.userSettings = new Map();
    this.privacySettings = this.getDefaultPrivacySettings();
    this.isInitialized = false;

    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.applyTheme();
    this.isInitialized = true;
    console.log('Settings system initialized');
  }

  getDefaultSettings() {
    return {
      // Appearance
      theme: 'dark',
      accentColor: '#3b82f6',
      fontSize: 'medium',
      compactMode: false,
      animations: true,

      // Trading Preferences
      defaultAccountSize: 10000,
      defaultRiskPercent: 2.0,
      defaultStopLoss: 50,
      preferredMarkets: ['forex', 'crypto'],
      favoritePairs: ['EURUSD', 'BTCUSD'],
      defaultTimeframe: '1D',

      // Notifications
      emailNotifications: true,
      pushNotifications: false,
      soundAlerts: true,
      performanceAlerts: true,
      riskAlerts: true,

      // Privacy
      dataCollection: true,
      analytics: true,
      marketingEmails: false,
      twoFactorEnabled: false,

      // Data Management
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetentionDays: 365,
      exportFormat: 'json',

      // Chart Settings
      chartTheme: 'dark',
      chartInterval: '1D',
      chartStudies: ['MASimple', 'RSI'],
      chartAutoSave: true,

      // Journal Settings
      autoTradeRecording: true,
      emotionTracking: true,
      psychologyTracking: true,
      minimumNoteLength: 10,

      // Performance
      performanceTracking: true,
      benchmarkComparison: true,
      goalTracking: true,
      milestoneAlerts: true,
    };
  }

  getDefaultPrivacySettings() {
    return {
      // GDPR Compliance
      gdprConsent: {
        essential: true,
        functional: true,
        analytics: true,
        marketing: false,
      },

      // Data Processing
      dataProcessing: {
        performanceAnalytics: true,
        behavioralAnalytics: false,
        crossDeviceTracking: false,
        thirdPartySharing: false,
      },

      // User Rights
      rights: {
        rightToAccess: true,
        rightToRectification: true,
        rightToErasure: true,
        rightToRestrictProcessing: true,
        rightToDataPortability: true,
        rightToObject: true,
      },

      // Data Retention
      retention: {
        accountData: 'until_deletion',
        tradingData: '7_years',
        analyticsData: '26_months',
        marketingData: 'do_not_store',
      },

      // Security
      security: {
        sessionTimeout: 30, // minutes
        passwordComplexity: 'high',
        loginNotifications: true,
        suspiciousActivityAlerts: true,
      },
    };
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Settings form listeners
    this.setupSettingsFormListeners();

    // Privacy controls
    this.setupPrivacyListeners();

    // Export/Import listeners
    this.setupDataManagementListeners();
  }

  setupSettingsFormListeners() {
    // Profile settings
    const profileInputs = ['settings-firstname', 'settings-lastname', 'settings-email'];

    profileInputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', (e) => {
          this.updateSetting(id.replace('settings-', ''), e.target.value);
        });
      }
    });

    // Trading preferences
    const tradingInputs = ['settings-account-size', 'settings-risk-percent', 'settings-markets'];

    tradingInputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', (e) => {
          this.updateTradingSetting(id.replace('settings-', ''), e.target.value);
        });
      }
    });

    // Save settings button
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveAllSettings();
      });
    }
  }

  setupPrivacyListeners() {
    // Privacy toggles
    const privacyToggles = document.querySelectorAll('[data-privacy-setting]');
    privacyToggles.forEach((toggle) => {
      toggle.addEventListener('change', (e) => {
        const setting = e.target.dataset.privacySetting;
        this.updatePrivacySetting(setting, e.target.checked);
      });
    });

    // Data export buttons
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportUserData();
      });
    }

    // Data deletion button
    const deleteBtn = document.getElementById('delete-data-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.requestDataDeletion();
      });
    }
  }

  setupDataManagementListeners() {
    // Auto-backup toggle
    const autoBackupToggle = document.getElementById('auto-backup-toggle');
    if (autoBackupToggle) {
      autoBackupToggle.addEventListener('change', (e) => {
        this.updateSetting('autoBackup', e.target.checked);
        if (e.target.checked) {
          this.scheduleAutoBackup();
        } else {
          this.cancelAutoBackup();
        }
      });
    }

    // Manual backup button
    const backupBtn = document.getElementById('backup-now-btn');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => {
        this.createBackup();
      });
    }

    // Import data button
    const importBtn = document.getElementById('import-data-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        this.showImportDialog();
      });
    }
  }

  // Settings Management
  getSetting(key) {
    return this.settings[key];
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.applySettingChange(key, value);
    this.saveSettings();

    // Show confirmation
    this.showNotification(`${key} updated successfully`, 'success');
  }

  updateTradingSetting(key, value) {
    if (key === 'markets' && typeof value === 'string') {
      value = value
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m);
    }

    if (key === 'account-size' || key === 'risk-percent') {
      value = parseFloat(value);
    }

    this.updateSetting(key, value);
  }

  updatePrivacySetting(key, value) {
    this.privacySettings[key] = value;
    this.savePrivacySettings();

    // Apply privacy changes
    this.applyPrivacyChange(key, value);

    this.showNotification(`Privacy setting updated`, 'success');
  }

  applySettingChange(key, value) {
    switch (key) {
      case 'theme':
        this.applyTheme(value);
        break;
      case 'accentColor':
        this.applyAccentColor(value);
        break;
      case 'fontSize':
        this.applyFontSize(value);
        break;
      case 'animations':
        this.applyAnimations(value);
        break;
      case 'compactMode':
        this.applyCompactMode(value);
        break;
    }
  }

  applyPrivacyChange(key, value) {
    switch (key) {
      case 'dataCollection':
        this.toggleDataCollection(value);
        break;
      case 'analytics':
        this.toggleAnalytics(value);
        break;
      case 'twoFactorEnabled':
        this.toggleTwoFactor(value);
        break;
    }
  }

  // Theme and Appearance
  toggleTheme() {
    const currentTheme = this.settings.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    this.updateSetting('theme', newTheme);
    this.applyTheme(newTheme);
  }

  applyTheme(theme = this.settings.theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update TradingView theme if available
    if (window.tradingView && window.tradingView.widget) {
      // TradingView theme change would require reinitialization
    }

    // Update all theme-dependent elements
    this.updateThemeElements(theme);
  }

  updateThemeElements(theme) {
    const bgColor = theme === 'dark' ? '#0a0e1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#000000';

    // Update CSS custom properties
    document.documentElement.style.setProperty('--bg-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
  }

  applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
  }

  applyFontSize(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };

    document.documentElement.style.setProperty('--base-font-size', sizes[size] || sizes.medium);
  }

  applyAnimations(enabled) {
    if (!enabled) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }

  applyCompactMode(enabled) {
    document.body.classList.toggle('compact-mode', enabled);
  }

  // Trading Preferences
  setDefaultTradingPreferences(preferences) {
    Object.assign(this.settings, preferences);
    this.saveSettings();
  }

  getTradingPreferences() {
    return {
      accountSize: this.settings.defaultAccountSize,
      riskPercent: this.settings.defaultRiskPercent,
      stopLoss: this.settings.defaultStopLoss,
      markets: this.settings.preferredMarkets,
      pairs: this.settings.favoritePairs,
      timeframe: this.settings.defaultTimeframe,
    };
  }

  // Notifications
  updateNotificationSettings(settings) {
    Object.assign(this.settings, settings);
    this.saveSettings();

    // Request notification permissions if needed
    if (settings.pushNotifications && 'Notification' in window) {
      Notification.requestPermission();
    }
  }

  sendNotification(title, options = {}) {
    if (!this.settings.pushNotifications) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }

  // Privacy and Security
  toggleDataCollection(enabled) {
    if (!enabled) {
      // Disable analytics and tracking
      this.disableAnalytics();
    }

    this.showNotification(
      `Data collection ${enabled ? 'enabled' : 'disabled'}. Some features may be limited.`,
      enabled ? 'success' : 'warning'
    );
  }

  toggleAnalytics(enabled) {
    if (!enabled) {
      // Disable analytics tracking
      this.disableAnalytics();
    }

    this.showNotification(
      `Analytics ${enabled ? 'enabled' : 'disabled'}. Performance insights may be limited.`,
      enabled ? 'success' : 'warning'
    );
  }

  disableAnalytics() {
    // Disable Google Analytics, Mixpanel, etc.
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', { send_page_view: false });
    }

    // Disable custom analytics
    window.disableAnalytics = true;
  }

  toggleTwoFactor(enabled) {
    if (enabled) {
      this.enableTwoFactor();
    } else {
      this.disableTwoFactor();
    }
  }

  enableTwoFactor() {
    // In a real implementation, this would integrate with a 2FA service
    this.showNotification('Two-factor authentication enabled', 'success');
  }

  disableTwoFactor() {
    this.showNotification('Two-factor authentication disabled', 'warning');
  }

  // Data Management
  exportUserData() {
    const userData = {
      settings: this.settings,
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `eternum-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.showNotification('Settings exported successfully', 'success');
  }

  importUserData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.settings) {
            this.settings = { ...this.settings, ...data.settings };
          }

          if (data.privacySettings) {
            this.privacySettings = { ...this.privacySettings, ...data.privacySettings };
          }

          this.saveSettings();
          this.applyAllSettings();

          this.showNotification('Settings imported successfully', 'success');
          resolve();
        } catch (error) {
          this.showNotification('Error importing settings', 'error');
          reject(error);
        }
      };

      reader.readAsText(file);
    });
  }

  requestDataDeletion() {
    const confirmed = confirm(
      'Are you sure you want to delete all your data? This action cannot be undone.'
    );

    if (confirmed) {
      this.deleteAllUserData();
      this.showNotification('Data deletion request submitted', 'success');
    }
  }

  deleteAllUserData() {
    // Clear localStorage
    const userKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith('eternum_') && !key.includes('system_')
    );

    userKeys.forEach((key) => localStorage.removeItem(key));

    // Clear session storage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    // Redirect to login
    if (window.app) {
      window.app.logout();
    }
  }

  // Backup and Recovery
  scheduleAutoBackup() {
    if (!this.settings.autoBackup) return;

    const frequencies = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };

    const interval = frequencies[this.settings.backupFrequency] || frequencies.weekly;

    this.backupInterval = setInterval(() => {
      this.createBackup();
    }, interval);
  }

  cancelAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  createBackup() {
    const backupData = {
      settings: this.settings,
      privacySettings: this.privacySettings,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    // Include user data if available
    if (window.app && window.app.currentUser) {
      backupData.userData = {
        trades: window.app.trades,
        notes: window.app.notes,
        userId: window.app.currentUser.id,
      };
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `eternum-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.showNotification('Backup created successfully', 'success');

    // Store backup info
    this.storeBackupInfo(backupData.timestamp);
  }

  storeBackupInfo(timestamp) {
    const backups = JSON.parse(localStorage.getItem('eternum_backups') || '[]');
    backups.push({
      timestamp,
      size: 'auto', // Would be actual size in real implementation
    });

    // Keep only last 10 backup records
    if (backups.length > 10) {
      backups.splice(0, backups.length - 10);
    }

    localStorage.setItem('eternum_backups', JSON.stringify(backups));
  }

  restoreBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);

          if (backup.settings) {
            this.settings = { ...this.getDefaultSettings(), ...backup.settings };
          }

          if (backup.privacySettings) {
            this.privacySettings = {
              ...this.getDefaultPrivacySettings(),
              ...backup.privacySettings,
            };
          }

          // Restore user data if available
          if (backup.userData && window.app) {
            if (backup.userData.trades) {
              window.app.trades = backup.userData.trades;
              window.app.saveTrades();
            }

            if (backup.userData.notes) {
              window.app.notes = backup.userData.notes;
              window.app.saveNotes();
            }
          }

          this.saveSettings();
          this.applyAllSettings();

          this.showNotification('Backup restored successfully', 'success');
          resolve();
        } catch (error) {
          this.showNotification('Error restoring backup', 'error');
          reject(error);
        }
      };

      reader.readAsText(file);
    });
  }

  // Utility Methods
  applyAllSettings() {
    // Apply all current settings
    Object.entries(this.settings).forEach(([key, value]) => {
      this.applySettingChange(key, value);
    });
  }

  saveSettings() {
    try {
      localStorage.setItem('eternum_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  savePrivacySettings() {
    try {
      localStorage.setItem('eternum_privacy_settings', JSON.stringify(this.privacySettings));
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('eternum_settings');
      if (savedSettings) {
        this.settings = { ...this.getDefaultSettings(), ...JSON.parse(savedSettings) };
      }

      const savedPrivacy = localStorage.getItem('eternum_privacy_settings');
      if (savedPrivacy) {
        this.privacySettings = { ...this.getDefaultPrivacySettings(), ...JSON.parse(savedPrivacy) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = this.getDefaultSettings();
      this.privacySettings = this.getDefaultPrivacySettings();
    }
  }

  showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.importUserData(file);
      }
    };

    input.click();
  }

  showNotification(message, type = 'info') {
    // Use app's notification system if available
    if (window.app && window.app.showNotification) {
      window.app.showNotification(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API
  getSettings() {
    return { ...this.settings };
  }

  getPrivacySettings() {
    return { ...this.privacySettings };
  }

  resetSettings() {
    this.settings = this.getDefaultSettings();
    this.privacySettings = this.getDefaultPrivacySettings();
    this.saveSettings();
    this.savePrivacySettings();
    this.applyAllSettings();

    this.showNotification('Settings reset to defaults', 'success');
  }

  exportSettings() {
    return {
      settings: this.settings,
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
  }
}

// Initialize settings system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.settingsSystem = new SettingsSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SettingsSystem };
}
