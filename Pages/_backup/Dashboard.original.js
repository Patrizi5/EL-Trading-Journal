import React from 'react';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import PLChart from '@/components/dashboard/PLChart';
import RecentTrades from '@/components/dashboard/RecentTrades';
import StrategyBreakdown from '@/components/dashboard/StrategyBreakdown';

export default function Dashboard({ data = {} }) {
  return (
    <div className="space-y-4">
      <PortfolioSummary portfolio={data.portfolio} />
      <div className="grid grid-cols-3 gap-4">
        <PLChart data={data.pnl} />
        <RecentTrades trades={data.recentTrades} />
        <StrategyBreakdown strategies={data.strategies} />
      </div>
    </div>
  );
}
