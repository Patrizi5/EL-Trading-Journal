import NotesSystem from './components/NotesSystem';
import React, { useEffect, useState } from 'react';
import { db, ITrade, calculateERS } from './db';
import { MARKETS, MarketKey } from './markets';
import EquityChart from './components/EquityChart';
import PositionCalc from './components/PositionCalc';
import PsychMirror from './components/PsychMirror';
import ThemeToggle from './components/ThemeToggle';
import PsychChart from './components/PsychChart';
import TradeExit from './components/TradeExit';
import SymbolPicker from './components/SymbolPicker';
import LiveChart from './components/LiveChart';
import { ExportCSV } from './components/ExportCSV';
import OptionChain from './components/options/OptionChain';
import SubscriptionGate from './components/subscription/SubscriptionGate';
import CompanyModule from './components/company/CompanyModule';
import AnimatedHero from './components/hero/AnimatedHero';

export default function App() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [market, setMarket] = useState<MarketKey>('forex');
  const [symbol, setSymbol] = useState('EURUSD');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [entry, setEntry] = useState('');
  const [psychData, setPsychData] = useState<any>(null);
  const [exitModal, setExitModal] = useState<ITrade | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    db.trades.toArray().then(setTrades);
  }, []);

  const addTrade = async () => {
    if (!entry) return;
    await db.trades.add({
      market,
      symbol,
      side,
      entry: parseFloat(entry),
      size: 1,
      opened: new Date(),
      psych: psychData,
      notes,
    });
    setEntry('');
    setNotes('');
    setPsychData(null);
    setTrades(await db.trades.toArray());
  };

  const handleTradeExit = async () => {
    setExitModal(null);
    setTrades(await db.trades.toArray());
  };

  return (
    <SubscriptionGate>
      <div className="app-container">
        <div className="bubbles">
          <div className="bubble pink-bubble" />
          <div className="bubble blue-bubble" />
          <div className="bubble small-p-bubble" />
          <div className="bubble small-b-bubble" />
        </div>

        <div className="panel min-h-screen bg-shell-dark text-shell-text font-shell p-6">
          <AnimatedHero />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-shell-accent pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-shell-green to-blue-400 bg-clip-text text-transparent">
              Eternum Trading Journal
            </h1>
            <ThemeToggle />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="col-span-1">
              <CompanyModule />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Position Calculator Card */}
              <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                <h2 className="text-xl font-semibold mb-3 text-shell-green">Position Calculator</h2>
                <PositionCalc />
              </div>

              {/* Trade Entry Card */}
              <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                <h2 className="text-xl font-semibold mb-3 text-shell-green">Trade Entry</h2>
                <div className="flex gap-3 mb-4 items-center flex-wrap">
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value as MarketKey)}
                    className="bg-shell-accent text-shell-text px-3 py-2 rounded border border-shell-glow focus:outline-none focus:border-shell-green"
                  >
                    {Object.entries(MARKETS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name}
                      </option>
                    ))}
                  </select>

                  <SymbolPicker market={market} onSelect={setSymbol} />

                  <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as any)}
                    className="bg-shell-accent text-shell-text px-3 py-2 rounded border border-shell-glow focus:outline-none focus:border-shell-green"
                  >
                    <option value="long" className="text-black">
                      Long
                    </option>
                    <option value="short" className="text-black">
                      Short
                    </option>
                  </select>

                  <input
                    className="bg-shell-accent text-shell-text px-3 py-2 rounded border border-shell-glow focus:outline-none focus:border-shell-green"
                    placeholder="Entry price"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                  />

                  <ExportCSV />

                  <button
                    className="bg-gradient-to-r from-shell-green to-emerald-500 px-5 py-2 rounded font-semibold hover:from-emerald-500 hover:to-shell-green transition-all shadow-lg shadow-emerald-500/20"
                    onClick={addTrade}
                  >
                    Add Trade
                  </button>
                </div>

                <div className="mt-4">{symbol && <LiveChart symbol={symbol} />}</div>

                <div className="mt-4">{/* Option chain generator for optionable underlyings */}
                  <OptionChain />
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                <h2 className="text-lg font-semibold mb-3 text-shell-green">Trade Notes</h2>
                <textarea
                  className="w-full bg-shell-accent text-shell-text px-3 py-2 rounded border border-shell-glow focus:outline-none focus:border-shell-green"
                  placeholder="Market context, emotional state, rule violations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Psychological Mirror Card */}
              <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                <h2 className="text-lg font-semibold mb-3 text-shell-green">Psychological Mirror</h2>
                <PsychMirror onSave={setPsychData} />
              </div>

              <NotesSystem />

              {/* Trades List */}
              <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                <h2 className="text-xl font-semibold mb-3 text-shell-green">Trade Journal</h2>
                <ul className="space-y-3">
                  {trades.map((t) => (
                    <li
                      key={t.id}
                      className="bg-shell-accent rounded-lg p-4 flex items-center justify-between border border-shell-glow hover:border-shell-green transition-all"
                    >
                      <div>
                        <div className="font-semibold">
                          {t.symbol} • {t.side.toUpperCase()}
                        </div>
                        <div className="text-sm text-shell-text/70">Entry: {t.entry}</div>
                        {t.exit && (
                          <div className="text-sm text-shell-text/70">Exit: {t.exit} • P&L: ${t.pnl?.toFixed(2)}</div>
                        )}
                        {t.notes && <div className="text-xs text-shell-text/50 mt-1 italic">"{t.notes}"</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {!t.exit && (
                          <button
                            className="bg-shell-red px-3 py-1 rounded text-xs font-bold hover:bg-red-500 transition-all"
                            onClick={() => setExitModal(t)}
                          >
                            EXIT
                          </button>
                        )}
                        {t.psych?.pre && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              calculateERS(t.psych) > 60
                                ? 'bg-shell-red text-white'
                                : calculateERS(t.psych) > 30
                                ? 'bg-yellow-600 text-black'
                                : 'bg-shell-green text-black'
                            }`}
                          >
                            ERS
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equity Curve */}
                {trades.filter((t) => t.exit != null).length > 0 && (
                  <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                    <h2 className="text-lg font-semibold mb-3 text-shell-green">Equity Curve</h2>
                    <EquityChart
                      trades={trades.filter((t) => t.exit != null).map((t) => ({ id: t.id!, date: t.opened.toISOString(), pnl: t.pnl! }))}
                    />
                  </div>
                )}

                {/* ERS vs P&L */}
                {trades.filter((t) => t.psych?.pre).length > 0 && (
                  <div className="bg-shell-card rounded-xl p-4 border border-shell-accent shadow-xl shadow-black/30">
                    <h2 className="text-lg font-semibold mb-3 text-shell-green">ERS vs P&L</h2>
                    <PsychChart
                      trades={trades.filter((t) => t.psych?.pre && t.pnl != null).map((t) => ({ ers: calculateERS(t.psych), pnl: t.pnl! }))}
                    />
                  </div>
                )}
              </div>

              {/* Exit Modal */}
              {exitModal && <TradeExit trade={exitModal} onClose={handleTradeExit} />}
            </div>
          </div>
        </div>
      </div>
    </SubscriptionGate>
  );
}
