import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTrades({ trades = [], onViewTrade }) {
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Recent Trades</h3>
            <p className="text-slate-400 text-sm">Your latest activity</p>
          </div>
        </div>

        {recentTrades.length > 0 ? (
          <div className="space-y-3">
            {recentTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onViewTrade?.(trade)}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${trade.type === 'long' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {trade.type === 'long' ? (
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{trade.symbol}</span>
                      {trade.market_type && (
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 capitalize">
                          {trade.market_type}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-xs border-0 ${trade.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700/50 text-slate-400'}`}>
                        {trade.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {trade.quantity} @ ${trade.entry_price?.toFixed(2)}
                      {trade.timeframe && <span className="text-blue-400 ml-2">{trade.timeframe}</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {trade.status === 'closed' && trade.profit_loss !== undefined ? (
                    <>
                      <div className={`flex items-center gap-1 ${trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.profit_loss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-semibold">
                          {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss?.toFixed(2)}
                        </span>
                      </div>
                      {trade.result_r && (
                        <p className={`text-xs mt-1 ${trade.result_r >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                          {trade.result_r >= 0 ? '+' : ''}{trade.result_r?.toFixed(2)}R
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400 text-sm">Active</span>
                  )}
                  <p className="text-slate-500 text-xs mt-1">
                    {format(new Date(trade.entry_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No trades yet. Start logging your trades!</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
