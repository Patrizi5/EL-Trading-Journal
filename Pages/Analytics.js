import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Target, Calendar, Brain, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className={`font-bold ${payload[0].value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => base44.entities.Trade.list('-entry_date')
  });

  const closedTrades = trades.filter(t => t.status === 'closed');
  const winningTrades = closedTrades.filter(t => (t.profit_loss || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.profit_loss || 0) < 0);

  // Key metrics
  const totalPL = closedTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100) : 0;
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / losingTrades.length) : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;
  const expectancy = closedTrades.length > 0 ? totalPL / closedTrades.length : 0;

  // Best/worst trades
  const bestTrade = closedTrades.length > 0 ? closedTrades.reduce((best, t) => (t.profit_loss || 0) > (best.profit_loss || 0) ? t : best) : null;
  const worstTrade = closedTrades.length > 0 ? closedTrades.reduce((worst, t) => (t.profit_loss || 0) < (worst.profit_loss || 0) ? t : worst) : null;

  // Daily P&L data
  const dailyPL = closedTrades.reduce((acc, trade) => {
    if (!trade.exit_date) return acc;
    const date = format(new Date(trade.exit_date), 'MMM dd');
    acc[date] = (acc[date] || 0) + (trade.profit_loss || 0);
    return acc;
  }, {});

  const dailyChartData = Object.entries(dailyPL)
    .slice(-14)
    .map(([date, value]) => ({ date, value }));

  // Day of week analysis
  const dayOfWeekPL = closedTrades.reduce((acc, trade) => {
    if (!trade.exit_date) return acc;
    const day = format(new Date(trade.exit_date), 'EEE');
    if (!acc[day]) acc[day] = { pl: 0, count: 0 };
    acc[day].pl += trade.profit_loss || 0;
    acc[day].count++;
    return acc;
  }, {});

  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dayChartData = daysOrder.map(day => ({
    day,
    value: dayOfWeekPL[day]?.pl || 0,
    trades: dayOfWeekPL[day]?.count || 0
  }));

  // Emotion analysis
  const emotionResults = closedTrades.reduce((acc, trade) => {
    if (!trade.emotion_entry) return acc;
    if (!acc[trade.emotion_entry]) acc[trade.emotion_entry] = { wins: 0, losses: 0, pl: 0 };
    acc[trade.emotion_entry].pl += trade.profit_loss || 0;
    if ((trade.profit_loss || 0) > 0) acc[trade.emotion_entry].wins++;
    else acc[trade.emotion_entry].losses++;
    return acc;
  }, {});

  const emotionData = Object.entries(emotionResults).map(([emotion, data]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    winRate: data.wins + data.losses > 0 ? (data.wins / (data.wins + data.losses) * 100).toFixed(0) : 0,
    pl: data.pl,
    total: data.wins + data.losses
  }));

  const StatCard = ({ label, value, icon: Icon, subvalue, positive, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{label}</p>
            <p className={`text-2xl font-bold mt-1 tracking-tight ${positive !== undefined ? (positive ? 'text-emerald-400' : 'text-rose-400') : 'text-white'}`}>
              {value}
            </p>
            {subvalue && <p className="text-slate-500 text-sm mt-1">{subvalue}</p>}
          </div>
          <div className={`p-3 rounded-xl ${positive !== false ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
            <Icon className={`w-5 h-5 ${positive !== false ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 rounded-xl bg-purple-500/10">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Analytics</h1>
            <p className="text-slate-400 mt-1">Deep dive into your trading performance</p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} icon={Target} positive={winRate >= 50} delay={0} subvalue={`${winningTrades.length}W / ${losingTrades.length}L`} />
          <StatCard label="Profit Factor" value={profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)} icon={Zap} positive={profitFactor >= 1} delay={0.1} />
          <StatCard label="Avg Win" value={`$${avgWin.toFixed(2)}`} icon={TrendingUp} positive={true} delay={0.2} />
          <StatCard label="Avg Loss" value={`$${avgLoss.toFixed(2)}`} icon={TrendingDown} positive={false} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily P&L */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold text-lg">Daily P&L</h3>
              </div>
              {dailyChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {dailyChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">No data yet</div>
              )}
            </Card>
          </motion.div>

          {/* Day of Week */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold text-lg">Performance by Day</h3>
              </div>
              {dayChartData.some(d => d.trades > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {dayChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">No data yet</div>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Emotion Analysis */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-pink-400" />
                <h3 className="text-white font-semibold text-lg">Trading Psychology</h3>
              </div>
              {emotionData.length > 0 ? (
                <div className="grid gap-3">
                  {emotionData.map((item, _index) => (
                    <div key={item.emotion} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                        <span className="text-white font-medium">{item.emotion}</span>
                        <span className="text-slate-500 text-sm">({item.total} trades)</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-slate-400 text-sm">Win Rate</span>
                          <p className={`font-semibold ${parseFloat(item.winRate) >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{item.winRate}%</p>
                        </div>
                        <div className="text-right w-24">
                          <span className="text-slate-400 text-sm">P&L</span>
                          <p className={`font-semibold ${item.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.pl >= 0 ? '+' : ''}${item.pl.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>Start tracking your emotions on trades to see insights</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Best/Worst Trades */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-6">Notable Trades</h3>
              
              {bestTrade && (
                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-2">Best Trade</p>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{bestTrade.symbol}</span>
                      <span className="text-emerald-400 font-bold">+${bestTrade.profit_loss?.toFixed(2)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{bestTrade.strategy}</p>
                  </div>
                </div>
              )}

              {worstTrade && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Worst Trade</p>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{worstTrade.symbol}</span>
                      <span className="text-rose-400 font-bold">${worstTrade.profit_loss?.toFixed(2)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{worstTrade.strategy}</p>
                  </div>
                </div>
              )}

              {!bestTrade && !worstTrade && (
                <div className="text-center py-8 text-slate-500">
                  <p>Complete some trades to see highlights</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-2">Expectancy</p>
                <p className={`text-2xl font-bold ${expectancy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${expectancy.toFixed(2)}/trade
                </p>
                <p className="text-slate-500 text-sm mt-1">Average expected return per trade</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}