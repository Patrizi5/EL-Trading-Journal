import React from 'react';
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-xs mb-1">{payload[0].payload.date}</p>
        <p className={`text-lg font-bold ${payload[0].value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        {payload[0].payload.trades && (
          <p className="text-slate-500 text-xs mt-1">{payload[0].payload.trades} trades</p>
        )}
      </div>
    );
  }
  return null;
};

export default function EquityChart({ trades = [], startingBalance = 10000 }) {
  const closedTrades = trades
    .filter(t => t.status === 'closed' && t.exit_date)
    .sort((a, b) => new Date(a.exit_date) - new Date(b.exit_date));

  let balance = startingBalance;
  const chartData = [{ date: 'Start', value: 0, balance: startingBalance, trades: 0 }];

  closedTrades.forEach((trade, index) => {
    balance += (trade.profit_loss || 0);
    const cumulative = balance - startingBalance;
    chartData.push({
      date: format(new Date(trade.exit_date), 'MMM dd'),
      value: cumulative,
      balance: balance,
      trades: index + 1,
      symbol: trade.symbol
    });
  });

  const currentPL = balance - startingBalance;
  const isPositive = currentPL >= 0;
  const plPercent = ((currentPL / startingBalance) * 100).toFixed(2);

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Equity Curve</h3>
            <p className="text-slate-400 text-sm">Account performance over time</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Current Balance</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm ${isPositive ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
            {isPositive ? '+' : ''}{plPercent}%
          </p>
        </div>
      </div>

      {chartData.length > 1 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
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
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10b981" : "#f43f5e"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#equityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Complete some trades to see your equity curve</p>
          </div>
        </div>
      )}
    </Card>
  );
}