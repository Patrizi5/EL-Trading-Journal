import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

import TradeForm from '../components/trades/TradeForm';

const strategyColors = {
  breakout: 'bg-blue-500/10 text-blue-400',
  momentum: 'bg-purple-500/10 text-purple-400',
  reversal: 'bg-amber-500/10 text-amber-400',
  scalp: 'bg-pink-500/10 text-pink-400',
  swing: 'bg-cyan-500/10 text-cyan-400',
  earnings: 'bg-emerald-500/10 text-emerald-400',
  news: 'bg-rose-500/10 text-rose-400',
  technical: 'bg-indigo-500/10 text-indigo-400',
  other: 'bg-slate-500/10 text-slate-400'
};

export default function Journal() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [strategyFilter, setStrategyFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => base44.entities.Trade.list('-entry_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Trade.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      setShowForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Trade.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      setShowForm(false);
      setSelectedTrade(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Trade.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] })
  });

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.setup_notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
    const matchesStrategy = strategyFilter === 'all' || trade.strategy === strategyFilter;
    return matchesSearch && matchesStatus && matchesStrategy;
  });

  const handleSave = (data) => {
    if (selectedTrade) {
      updateMutation.mutate({ id: selectedTrade.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (trade) => {
    setSelectedTrade(trade);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Trade Journal</h1>
            <p className="text-slate-400 mt-1">Document and analyze your trades</p>
          </div>
          <Button 
            onClick={() => { setSelectedTrade(null); setShowForm(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol, notes, or tags..."
              className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-800 text-slate-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={strategyFilter} onValueChange={setStrategyFilter}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-800 text-slate-300">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Strategies</SelectItem>
                <SelectItem value="breakout">Breakout</SelectItem>
                <SelectItem value="momentum">Momentum</SelectItem>
                <SelectItem value="reversal">Reversal</SelectItem>
                <SelectItem value="scalp">Scalp</SelectItem>
                <SelectItem value="swing">Swing</SelectItem>
                <SelectItem value="earnings">Earnings</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Trades Grid */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                <Card 
                  className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6 hover:bg-slate-900/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleEdit(trade)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${trade.type === 'long' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        {trade.type === 'long' ? (
                          <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-rose-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white">{trade.symbol}</h3>
                          <Badge variant="outline" className={`border-0 ${trade.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700/50 text-slate-400'}`}>
                            {trade.status}
                          </Badge>
                          {trade.strategy && (
                            <Badge className={`${strategyColors[trade.strategy]} capitalize`}>
                              {trade.strategy}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <span>{trade.quantity} shares @ ${trade.entry_price?.toFixed(2)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(trade.entry_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {trade.setup_notes && (
                          <p className="text-slate-500 text-sm mt-2 line-clamp-2 max-w-xl">{trade.setup_notes}</p>
                        )}

                        {trade.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {trade.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-400 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 lg:gap-8">
                      {trade.screenshot_url && (
                        <img 
                          src={trade.screenshot_url} 
                          alt="Chart" 
                          className="w-24 h-16 object-cover rounded-lg border border-slate-700 hidden md:block"
                        />
                      )}
                      
                      <div className="text-right">
                        {trade.status === 'closed' && trade.profit_loss !== undefined ? (
                          <>
                            <div className={`flex items-center gap-1.5 justify-end ${trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {trade.profit_loss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                              <span className="text-2xl font-bold">
                                {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 justify-end text-sm">
                              {trade.profit_loss_percent && (
                                <span className={`${trade.profit_loss_percent >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                                  {trade.profit_loss_percent >= 0 ? '+' : ''}{trade.profit_loss_percent?.toFixed(2)}%
                                </span>
                              )}
                              {trade.result_r && (
                                <span className={`${trade.result_r >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                                  ({trade.result_r >= 0 ? '+' : ''}{trade.result_r?.toFixed(2)}R)
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400">Open Position</span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(trade.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTrades.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-slate-500 text-lg">No trades found. Start logging your trades!</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Trade
              </Button>
            </motion.div>
          )}
        </div>

        <TradeForm
          open={showForm}
          onClose={() => { setShowForm(false); setSelectedTrade(null); }}
          onSave={handleSave}
          trade={selectedTrade}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
}
import React from 'react';
import NotesSystem from '@/components/notes/NotesSystem';

export default function Journal() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Journal</h2>
      <NotesSystem />
    </div>
  );
}
