import { useState } from 'react';
import { MARKETS, MarketKey } from '../markets';

export default function SymbolPicker({
  market,
  onSelect,
}: {
  market: MarketKey;
  onSelect: (s: string) => void;
}) {
  const [search, setSearch] = useState('');

  // Spread into new array to make it mutable
  const symbols = [...MARKETS[market].symbols].filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        className="text-black px-2"
        placeholder="Search symbol"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="absolute top-10 left-0 bg-gray-900 border rounded max-h-48 overflow-y-auto w-64 z-10">
        {symbols.map((s) => (
          <div
            key={s}
            onClick={() => {
              onSelect(s);
              setSearch('');
            }}
            className="p-2 hover:bg-gray-700 cursor-pointer text-white"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
