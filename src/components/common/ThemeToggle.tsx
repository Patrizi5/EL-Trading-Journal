import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  const icons = {
    dark: Moon,
    light: Sun,
    blue: Palette
  };

  const Icon = icons[theme];

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-slate-700 bg-slate-800/50 hover:bg-slate-800"
    >
      <Icon className={cn("w-4 h-4", theme === 'light' ? 'text-amber-400' : 'text-slate-400')} />
    </Button>
  );
}