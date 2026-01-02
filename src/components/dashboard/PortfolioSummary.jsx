import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, change, icon: Icon, positive, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-5 hover:bg-slate-900/70 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{label}</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${positive !== false ? 'bg-emerald-500/10' : 'bg-rose-500/10'} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${positive !== false ? 'text-emerald-400' : 'text-rose-400'}`} />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function PortfolioSummary({ trades = [], portfolio = [] }) {
  const closedTrades = trades.filter(t => t.status === 'closed');
  const totalPL = closedTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
  const winningTrades = closedTrades.filter(t => (t.profit_loss || 0) > 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : 0;
  
  const portfolioValue = portfolio.reduce((sum, p) => sum + (p.shares * (p.current_price || p.avg_cost)), 0);
  const portfolioCost = portfolio.reduce((sum, p) => sum + (p.shares * p.avg_cost), 0);
  const unrealizedPL = portfolioValue - portfolioCost;
  
  const openTrades = trades.filter(t => t.status === 'open').length;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total P&L"
        value={`$${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={totalPL >= 0 ? `+${((totalPL / (portfolioCost || 1)) * 100).toFixed(2)}%` : `${((totalPL / (portfolioCost || 1)) * 100).toFixed(2)}%`}
        icon={DollarSign}
        positive={totalPL >= 0}
        delay={0}
      />
      <StatCard
        label="Win Rate"
        value={`${winRate}%`}
        change={`${winningTrades.length}/${closedTrades.length} trades`}
        icon={Percent}
        positive={parseFloat(winRate) >= 50}
        delay={0.1}
      />
      <StatCard
        label="Portfolio Value"
        value={`$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={unrealizedPL >= 0 ? `+$${unrealizedPL.toFixed(2)}` : `-$${Math.abs(unrealizedPL).toFixed(2)}`}
        icon={BarChart3}
        positive={unrealizedPL >= 0}
        delay={0.2}
      />
      <StatCard
        label="Open Positions"
        value={openTrades}
        icon={Target}
        delay={0.3}
      />
    </div>
  );
}
