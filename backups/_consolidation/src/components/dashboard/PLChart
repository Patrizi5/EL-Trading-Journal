import React from 'react';
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className={`text-lg font-bold ${payload[0].value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function PLChart({ trades = [] }) {
  const closedTrades = trades
    .filter(t => t.status === 'closed' && t.exit_date)
    .sort((a, b) => new Date(a.exit_date) - new Date(b.exit_date));

  let cumulative = 0;
  const chartData = closedTrades.map(trade => {
    cumulative += (trade.profit_loss || 0);
    return {
      date: format(new Date(trade.exit_date), 'MMM dd'),
      value: cumulative,
      symbol: trade.symbol
    };
  });

  // Add starting point
  if (chartData.length > 0) {
    chartData.unshift({ date: 'Start', value: 0 });
  }

  const isPositive = cumulative >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Cumulative P&L</h3>
            <p className="text-slate-400 text-sm">Performance over time</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isPositive ? '+' : ''}{cumulative.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </div>
        
        {chartData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10b981" : "#f43f5e"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 text-sm">Complete some trades to see your performance chart</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}