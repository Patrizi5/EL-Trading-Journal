import React, { useEffect, useState } from 'react';
import { db, ITrade } from './db';
import EquityChart from './components/EquityChart';

export default function App() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [market, setMarket] = useState('EURUSD');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [entry, setEntry] = useState('');

  useEffect(() => { db.trades.toArray().then(setTrades); }, []);

  const addTrade = async () => {
    if (!entry) return;
    await db.trades.add({
      market,
      side,
      entry: parseFloat(entry),
      size: 1,
      opened: new Date()
    });
    setEntry('');
    setTrades(await db.trades.toArray());
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Eternum</h1>
      <div className="flex gap-2 mb-4">
        <select value={market} onChange={(e) => setMarket(e.target.value)}>
          <option>EURUSD</option>
          <option>BTCUSD</option>
        </select>
        <select value={side} onChange={(e) => setSide(e.target.value as any)}>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <input
          className="text-black px-2"
          placeholder="Entry price"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button className="bg-green-600 px-3" onClick={addTrade}>
          Add
        </button>
        <button onClick={() => window.open('https://gumroad.com/l/eternum-pro/29','_blank')}>
          Export CSV (Pro - $29)
        </button>
      </div>

      <ul className="space-y-2">
        {trades.map(t => (
          <li key={t.id} className="p-2 bg-gray-800 rounded">
            {t.market} {t.side} @ {t.entry}
          </li>
        ))}
      </ul>

      {trades.filter(t => t.exit != null).length > 0 && (
  <EquityChart trades={trades.filter(t => t.exit != null).map(t => ({id:t.id!, date:t.opened.toISOString(), pnl:t.pnl!}))} />
)}
    </div>
  );
}