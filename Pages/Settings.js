import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Palette, DollarSign, Bell, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const THEMES = [
  { value: 'dark', label: 'Dark', colors: 'from-slate-950 via-slate-900 to-slate-950' },
  { value: 'light', label: 'Light', colors: 'from-slate-50 via-white to-slate-50' },
  { value: 'blue', label: 'Blue Night', colors: 'from-blue-950 via-slate-900 to-blue-950' }
];

export default function Settings() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    theme: 'dark',
    default_market_type: 'stocks',
    default_timeframe: '1d',
    default_risk_percent: '1',
    currency: 'USD',
    notifications_enabled: true
  });

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['userSettings'],
    queryFn: () => base44.entities.UserSettings.filter({ created_by: user?.email })
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (settings && settings.length > 0) {
      const userSettings = settings[0];
      setFormData({
        theme: userSettings.theme || 'dark',
        default_market_type: userSettings.default_market_type || 'stocks',
        default_timeframe: userSettings.default_timeframe || '1d',
        default_risk_percent: userSettings.default_risk_percent?.toString() || '1',
        currency: userSettings.currency || 'USD',
        notifications_enabled: userSettings.notifications_enabled !== false
      });
      // Apply theme
      document.documentElement.className = userSettings.theme || 'dark';
    }
  }, [settings]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.UserSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast.success('Settings saved successfully!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast.success('Settings updated successfully!');
    }
  });

  const handleSave = () => {
    const data = {
      ...formData,
      default_risk_percent: parseFloat(formData.default_risk_percent)
    };

    // Apply theme immediately
    document.documentElement.className = data.theme;

    if (settings && settings.length > 0) {
      updateMutation.mutate({ id: settings[0].id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleThemeChange = (theme) => {
    setFormData(prev => ({ ...prev, theme }));
    document.documentElement.className = theme;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <SettingsIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Settings</h1>
              <p className="text-slate-400 mt-1">Customize your trading journal</p>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </motion.div>

        <div className="space-y-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-semibold text-lg">Appearance</h2>
              </div>

              <div>
                <Label className="text-slate-400 mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {THEMES.map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => handleThemeChange(theme.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.theme === theme.value 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`h-16 rounded-lg bg-gradient-to-br ${theme.colors} mb-3`} />
                      <p className="text-white font-medium text-sm">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Trading Defaults */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-semibold text-lg">Trading Defaults</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-400">Default Market Type</Label>
                  <Select 
                    value={formData.default_market_type} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, default_market_type: v }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-400">Default Timeframe</Label>
                  <Select 
                    value={formData.default_timeframe} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, default_timeframe: v }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="30m">30 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1M">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-400">Default Risk % per Trade</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.default_risk_percent}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_risk_percent: e.target.value }))}
                    className="bg-slate-800 border-slate-700 mt-2"
                  />
                </div>

                <div>
                  <Label className="text-slate-400">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, currency: v }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-semibold text-lg">Notifications</h2>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                <div>
                  <p className="text-white font-medium">Enable Notifications</p>
                  <p className="text-slate-400 text-sm mt-1">Receive updates about your trades</p>
                </div>
                <Switch
                  checked={formData.notifications_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications_enabled: checked }))}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}