import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
// toast removed (unused)

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 rounded-xl bg-blue-500/10">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Profile</h1>
            <p className="text-slate-400 mt-1">Manage your account information</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-8">
            {/* Profile Picture Placeholder */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-white">{user?.full_name || 'Trader'}</h2>
              <p className="text-slate-400 text-sm mt-1">{user?.role === 'admin' ? 'Administrator' : 'Trader'}</p>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              <div>
                <Label className="text-slate-400 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  value={user?.full_name || ''}
                  disabled
                  className="bg-slate-800 border-slate-700 mt-2 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-400 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-800 border-slate-700 mt-2 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input
                  value={user?.created_date ? new Date(user.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  disabled
                  className="bg-slate-800 border-slate-700 mt-2 text-white"
                />
              </div>

              <div className="pt-6 border-t border-slate-800">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
            <h3 className="text-white font-semibold mb-4">Account Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-sm">Role</p>
                <p className="text-white font-semibold mt-1 capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-emerald-400 font-semibold mt-1">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-sm">Account ID</p>
                <p className="text-white font-semibold mt-1 text-xs">{user?.id?.slice(0, 8) || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
