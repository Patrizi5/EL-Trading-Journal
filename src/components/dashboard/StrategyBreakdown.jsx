import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-white font-medium capitalize">{payload[0].name}</p>
        <p className="text-slate-400 text-sm">{payload[0].value} trades ({payload[0].payload.percentage}%)</p>
      </div>
    );
  }
  return null;
};

export default function StrategyBreakdown({ trades = [] }) {
  const closedTrades = trades.filter(t => t.status === 'closed');
  
  const strategyData = closedTrades.reduce((acc, trade) => {
    const strategy = trade.strategy || 'other';
    acc[strategy] = (acc[strategy] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(strategyData).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
    percentage: ((value / closedTrades.length) * 100).toFixed(1)
  }));

  const strategyPL = closedTrades.reduce((acc, trade) => {
    const strategy = trade.strategy || 'other';
    if (!acc[strategy]) {
      acc[strategy] = { wins: 0, losses: 0, total: 0, pl: 0 };
    }
    acc[strategy].total++;
    acc[strategy].pl += trade.profit_loss || 0;
    if ((trade.profit_loss || 0) > 0) acc[strategy].wins++;
    else acc[strategy].losses++;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
        <div className="mb-6">
          <h3 className="text-white font-semibold text-lg">Strategy Breakdown</h3>
          <p className="text-slate-400 text-sm">Performance by strategy</p>
        </div>

        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {Object.entries(strategyPL).slice(0, 5).map(([strategy, data], index) => (
                <div key={strategy} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-300 text-sm capitalize">{strategy.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${data.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {data.pl >= 0 ? '+' : ''}${data.pl.toFixed(2)}
                    </span>
                    <p className="text-slate-500 text-xs">{((data.wins / data.total) * 100).toFixed(0)}% win rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">Complete some trades to see strategy analytics</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
