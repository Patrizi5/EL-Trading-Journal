import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, Briefcase, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-slate-400 text-sm">{payload[0].payload.percentage}% of portfolio</p>
        <p className="text-emerald-400 text-sm">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    avg_cost: '',
    current_price: '',
    sector: ''
  });
  const queryClient = useQueryClient();

  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.Portfolio.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Portfolio.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setShowForm(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Portfolio.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setShowForm(false);
      setSelectedHolding(null);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Portfolio.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] })
  });

  const resetForm = () => {
    setFormData({ symbol: '', name: '', shares: '', avg_cost: '', current_price: '', sector: '' });
  };

  const handleEdit = (holding) => {
    setSelectedHolding(holding);
    setFormData({
      symbol: holding.symbol || '',
      name: holding.name || '',
      shares: holding.shares?.toString() || '',
      avg_cost: holding.avg_cost?.toString() || '',
      current_price: holding.current_price?.toString() || '',
      sector: holding.sector || ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      shares: parseFloat(formData.shares),
      avg_cost: parseFloat(formData.avg_cost),
      current_price: formData.current_price ? parseFloat(formData.current_price) : parseFloat(formData.avg_cost)
    };

    if (selectedHolding) {
      updateMutation.mutate({ id: selectedHolding.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Calculate totals
  const totalValue = portfolio.reduce((sum, h) => sum + (h.shares * (h.current_price || h.avg_cost)), 0);
  const totalCost = portfolio.reduce((sum, h) => sum + (h.shares * h.avg_cost), 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  // Pie chart data
  const chartData = portfolio.map((h, i) => ({
    name: h.symbol,
    value: h.shares * (h.current_price || h.avg_cost),
    percentage: ((h.shares * (h.current_price || h.avg_cost) / totalValue) * 100).toFixed(1)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Portfolio</h1>
              <p className="text-slate-400 mt-1">Your current holdings</p>
            </div>
          </div>
          <Button 
            onClick={() => { setSelectedHolding(null); resetForm(); setShowForm(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Holding
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <p className="text-slate-400 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
              <p className="text-slate-400 text-sm">Total Cost Basis</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6 ${totalPL >= 0 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'}`}>
              <p className="text-slate-400 text-sm">Unrealized P&L</p>
              <div className="flex items-center gap-2 mt-1">
                {totalPL >= 0 ? <TrendingUp className="w-6 h-6 text-emerald-400" /> : <TrendingDown className="w-6 h-6 text-rose-400" />}
                <p className={`text-3xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
                </p>
                <span className={`text-sm ${totalPL >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                  ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
                </span>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {portfolio.map((holding, index) => {
                const currentValue = holding.shares * (holding.current_price || holding.avg_cost);
                const costBasis = holding.shares * holding.avg_cost;
                const pl = currentValue - costBasis;
                const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;

                return (
                  <motion.div
                    key={holding.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-5 hover:bg-slate-900/70 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: COLORS[index % COLORS.length] + '20', color: COLORS[index % COLORS.length] }}
                          >
                            {holding.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{holding.symbol}</h3>
                            <p className="text-slate-400 text-sm">{holding.shares} shares @ ${holding.avg_cost?.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-white font-semibold">${currentValue.toFixed(2)}</p>
                            <div className={`flex items-center gap-1 justify-end ${pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {pl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              <span className="text-sm">
                                {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPercent >= 0 ? '+' : ''}{plPercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-white"
                              onClick={() => handleEdit(holding)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              onClick={() => deleteMutation.mutate(holding.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {portfolio.length === 0 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No holdings yet</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Holding
                </Button>
              </motion.div>
            )}
          </div>

          {/* Allocation Chart */}
          {portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6 sticky top-8">
                <h3 className="text-white font-semibold mb-4">Allocation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
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
                <div className="space-y-2 mt-4">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Add/Edit Form Dialog */}
        <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) { setSelectedHolding(null); resetForm(); } }}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selectedHolding ? 'Edit Holding' : 'Add Holding'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Symbol</Label>
                  <Input
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    placeholder="AAPL"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">Shares</Label>
                  <Input
                    type="number"
                    value={formData.shares}
                    onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                    placeholder="100"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-400">Company Name (optional)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Apple Inc."
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Avg Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.avg_cost}
                    onChange={(e) => setFormData({ ...formData, avg_cost: e.target.value })}
                    placeholder="0.00"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">Current Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.current_price}
                    onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                    placeholder="0.00"
                    className="bg-slate-800 border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-400">Sector (optional)</Label>
                <Input
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  placeholder="Technology"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-700">Cancel</Button>
              <Button 
                onClick={handleSave} 
                disabled={!formData.symbol || !formData.shares || !formData.avg_cost || createMutation.isPending || updateMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedHolding ? 'Update' : 'Add Holding'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}