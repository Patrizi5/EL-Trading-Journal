import React, { useEffect, useState } from 'react';
import { db, ITrade, calculateERS } from './db';
import EquityChart from './components/EquityChart';
import PositionCalc from './components/PositionCalc';
import PsychMirror from './components/PsychMirror';
import ThemeToggle from './components/ThemeToggle';
import PsychChart from './components/PsychChart';
import TradeExit from './components/TradeExit';

export default function App() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [market, setMarket] = useState('EURUSD');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [entry, setEntry] = useState('');
  const [psychData, setPsychData] = useState<any>(null);
  const [exitModal, setExitModal] = useState<ITrade | null>(null);

  useEffect(() => { db.trades.toArray().then(setTrades); }, []);

  const addTrade = async () => {
    if (!entry) return;
    await db.trades.add({
      market,
      side,
      entry: parseFloat(entry),
      size: 1,
      opened: new Date(),
      psych: psychData
    });
    setEntry('');
    setPsychData(null);
    setTrades(await db.trades.toArray());
  };

  const handleTradeExit = async () => {
    setExitModal(null);
    setTrades(await db.trades.toArray());
  };

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Eternum</h1>
        <ThemeToggle />
      </div>

      <PositionCalc />

      <div className="flex gap-2 mb-4 items-center">
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

      <PsychMirror onSave={setPsychData} />

      <ul className="space-y-2">
        {trades.map(t => (
          <li key={t.id} className="p-2 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-between">
            <span>{t.market} {t.side} @ {t.entry}</span>
            {!t.exit && <button className="bg-red-600 px-2 text-xs" onClick={() => setExitModal(t)}>Exit</button>}
            {t.psych?.pre && <span className={`ml-2 px-2 rounded text-xs ${calculateERS(t.psych) > 60 ? 'bg-red-600' : calculateERS(t.psych) > 30 ? 'bg-yellow-600' : 'bg-green-600'}`}>ERS</span>}
          </li>
        ))}
      </ul>

      {trades.filter(t => t.exit != null).length > 0 && (
        <EquityChart trades={trades.filter(t => t.exit != null).map(t => ({id:t.id!, date:t.opened.toISOString(), pnl:t.pnl!}))} />
      )}
      
      {trades.filter(t => t.psych?.pre).length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6 mb-2">ERS vs P&L</h2>
          <PsychChart trades={trades.filter(t => t.psych?.pre && t.pnl != null).map(t => ({ ers: calculateERS(t.psych), pnl: t.pnl! }))} />
        </>
      )}

      {exitModal && <TradeExit trade={exitModal} onClose={handleTradeExit} />}
    </div>
  );
}