import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function TradeEntry({ onSubmit }) {
  const [formData, setFormData] = useState({
    symbol: '',
    market_type: 'stocks',
    type: 'long',
    entry_price: '',
    quantity: '',
    timeframe: '1d',
  });

  const handleQuickEntry = () => {
    if (!formData.symbol || !formData.entry_price || !formData.quantity) return;

    const trade = {
      ...formData,
      entry_price: parseFloat(formData.entry_price),
      quantity: parseFloat(formData.quantity),
      entry_date: new Date().toISOString(),
      status: 'open',
    };

    onSubmit(trade);
    setFormData({
      symbol: '',
      market_type: 'stocks',
      type: 'long',
      entry_price: '',
      quantity: '',
      timeframe: '1d',
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-emerald-400" />
        Quick Trade Entry
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Input
          placeholder="Symbol"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
          className="bg-slate-800 border-slate-700"
        />

        <Select
          value={formData.market_type}
          onValueChange={(v) => setFormData({ ...formData, market_type: v })}
        >
          <SelectTrigger className="bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="options">Options</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Entry"
          value={formData.entry_price}
          onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
          className="bg-slate-800 border-slate-700"
        />

        <Input
          type="number"
          placeholder="Size"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="bg-slate-800 border-slate-700"
        />

        <div className="flex gap-2">
          <Button
            variant={formData.type === 'long' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormData({ ...formData, type: 'long' })}
            className={
              formData.type === 'long'
                ? 'bg-emerald-600 hover:bg-emerald-700 flex-1'
                : 'border-slate-700 flex-1'
            }
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>
          <Button
            variant={formData.type === 'short' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormData({ ...formData, type: 'short' })}
            className={
              formData.type === 'short'
                ? 'bg-rose-600 hover:bg-rose-700 flex-1'
                : 'border-slate-700 flex-1'
            }
          >
            <ArrowDownRight className="w-4 h-4" />
          </Button>
        </div>

        <Button onClick={handleQuickEntry} className="bg-emerald-600 hover:bg-emerald-700">
          Enter
        </Button>
      </div>
    </Card>
  );
}
