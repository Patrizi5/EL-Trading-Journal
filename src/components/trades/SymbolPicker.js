import React, { useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp } from 'lucide-react';
import symbols from '../../../data/symbols.json';
import useDebounce from '@/utils/useDebounce';

export default function SymbolPicker({ market = 'Stocks', onSelect, value }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const normalized = useMemo(() => {
    return symbols.map((s) => ({
      ...s,
      key: (s.symbol || '').toString(),
      searchable: `${s.symbol} ${s.market} ${s.assetClass}`.toLowerCase(),
    }));
  }, []);

  useEffect(() => {
    if (!market) return;
    const match = [...new Set(symbols.map((s) => s.assetClass))].find(
      (a) => a.toLowerCase().includes(market.toString().toLowerCase())
    );
    if (match) setCategory(match);
  }, [market]);

  useEffect(() => {
    let active = true;

    async function fetchSymbols() {
      const q = (debouncedSearch || '').trim();
      const asset = category && category !== 'all' ? category : undefined;
      // If no meaningful query and no category, show local top results
      if (!q && (!asset || asset === 'all')) {
        setResults(normalized.slice(0, 100));
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (asset) params.set('asset', asset);
        const res = await fetch(`/api/symbols?${params.toString()}`);
        if (!active) return;
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        setResults((data && data.slice(0, 500)) || []);
      } catch (err) {
        // fallback to local filtering
        const ql = (debouncedSearch || '').trim().toLowerCase();
        setResults(
          normalized
            .filter((s) => (category === 'all' ? true : s.assetClass === category))
            .filter((s) => (ql ? s.searchable.includes(ql) || s.key.toLowerCase().includes(ql) : true))
            .slice(0, 100)
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSymbols();

    return () => {
      active = false;
    };
  }, [debouncedSearch, category, normalized]);

  const filtered = results;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symbol, market, or type..."
          className="pl-10 bg-slate-800 border-slate-700"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-slate-400 text-xs mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>Symbols</span>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700"
        >
          <option value="all">All Asset Classes</option>
          {[...new Set(symbols.map((s) => s.assetClass))].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto">
        {loading ? (
          <div className="col-span-3 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 text-slate-400">No results</div>
        ) : (
          filtered.map((s) => (
          <Badge
            key={s.key}
            variant={value === s.key ? 'default' : 'outline'}
            className={`cursor-pointer px-2 py-1 text-sm ${
              value === s.key ? 'luxury-badge' : 'border-slate-700 hover:bg-slate-800'
            }`}
            onClick={() => onSelect(s.key)}
          >
            <div className="font-semibold">{s.key}</div>
            <div className="text-xs text-slate-400">{s.assetClass}</div>
          </Badge>
          ))
        )}
      </div>
    </div>
  );
}
