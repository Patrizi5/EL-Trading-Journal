import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp } from 'lucide-react';

const POPULAR_SYMBOLS = {
  stocks: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META'],
  crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'XRP/USD'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
  options: ['SPY', 'QQQ', 'IWM', 'AAPL', 'TSLA']
};

export default function SymbolPicker({ marketType = 'stocks', onSelect, value }) {
  const [search, setSearch] = useState('');
  
  const symbols = POPULAR_SYMBOLS[marketType] || POPULAR_SYMBOLS.stocks;
  const filtered = search 
    ? symbols.filter(s => s.toLowerCase().includes(search.toLowerCase()))
    : symbols;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          placeholder="Search or type symbol..."
          className="pl-10 bg-slate-800 border-slate-700"
        />
      </div>

      <div>
        <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Popular
        </p>
        <div className="flex flex-wrap gap-2">
          {filtered.map(symbol => (
            <Badge
              key={symbol}
              variant={value === symbol ? "default" : "outline"}
              className={`cursor-pointer ${value === symbol ? 'bg-emerald-600' : 'border-slate-700 hover:bg-slate-800'}`}
              onClick={() => onSelect(symbol)}
            >
              {symbol}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
