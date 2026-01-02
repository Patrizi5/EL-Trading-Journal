import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Brain, TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3">
        <p className="text-white font-medium capitalize">{payload[0].payload.emotion}</p>
        <p className="text-slate-400 text-sm">{payload[0].payload.count} trades</p>
        <p className={`text-sm font-semibold ${payload[0].value >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {payload[0].value.toFixed(1)}% win rate
        </p>
      </div>
    );
  }
  return null;
};

export default function PsychChart({ trades = [] }) {
  const closedTrades = trades.filter(t => t.status === 'closed');
  
  const emotionData = closedTrades.reduce((acc, trade) => {
    if (!trade.emotion_entry) return acc;
    if (!acc[trade.emotion_entry]) {
      acc[trade.emotion_entry] = { wins: 0, total: 0 };
    }
    acc[trade.emotion_entry].total++;
    if ((trade.profit_loss || 0) > 0) acc[trade.emotion_entry].wins++;
    return acc;
  }, {});

  const chartData = Object.entries(emotionData)
    .map(([emotion, data]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      winRate: (data.wins / data.total) * 100,
      count: data.total
    }))
    .sort((a, b) => b.winRate - a.winRate);

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Emotion Analysis</h3>
          <p className="text-slate-400 text-sm">Win rate by emotional state</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="emotion" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.winRate >= 50 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-slate-500">
          <p>Track emotions on your trades to see insights</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-white font-medium">Best Performing Emotion</p>
          </div>
          <p className="text-emerald-400 text-lg font-semibold capitalize">
            {chartData[0].emotion} ({chartData[0].winRate.toFixed(1)}% win rate)
          </p>
        </div>
      )}
    </Card>
  );
}