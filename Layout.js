import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
  LayoutDashboard,
  BookOpen,
  Eye,
  Briefcase,
  BarChart3,
  Calculator,
  Brain,
  StickyNote,
  Settings,
  User,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Journal', icon: BookOpen, page: 'Journal' },
  { name: 'Watchlist', icon: Eye, page: 'Watchlist' },
  { name: 'Portfolio', icon: Briefcase, page: 'Portfolio' },
  { name: 'Analytics', icon: BarChart3, page: 'Analytics' },
  { name: 'Calculator', icon: Calculator, page: 'Calculator' },
];

const bottomNavItems = [
  { name: 'Psychology', icon: Brain, page: 'Psychology' },
  { name: 'Notes', icon: StickyNote, page: 'Notes' },
  { name: 'Profile', icon: User, page: 'Profile' },
  { name: 'Settings', icon: Settings, page: 'Settings' },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-xl flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/50">
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight block">EL TRADING</span>
              <span className="text-xs text-slate-400 font-medium">JOURNAL</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-slate-800/50 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 border-b border-slate-800/50 backdrop-blur-xl flex items-center justify-between px-4 z-50">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-lg font-bold text-white block leading-none">EL TRADING</span>
            <span className="text-[10px] text-slate-400 font-medium">JOURNAL</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-slate-950/95 backdrop-blur-xl z-40">
          <nav className="p-4 space-y-1">
            {[...navItems, ...bottomNavItems].map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-lg">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
