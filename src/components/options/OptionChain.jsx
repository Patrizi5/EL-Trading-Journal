import React, { useState } from 'react';
import optionChain from '@/utils/optionChain';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OptionChain() {
  const [underlying, setUnderlying] = useState('AAPL');
  const [expirations, setExpirations] = useState('2025-03-21');
  const [strikes, setStrikes] = useState('150,160,170');
  const [chain, setChain] = useState([]);

  const generate = () => {
    const exps = expirations.split(',').map((s) => s.trim());
    const strs = strikes.split(',').map((s) => Number(s.trim())).filter(Boolean);
    const generated = optionChain.buildOptionChain({ underlying, expirations: exps, strikes: strs, type: 'C' });
    setChain(generated);
  };

  return (
    <Card className="luxury-card p-4">
      <h3 className="text-lg font-semibold mb-3">Option Chain Generator</h3>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Input value={underlying} onChange={(e) => setUnderlying(e.target.value.toUpperCase())} placeholder="Underlying (e.g., AAPL)" />
        <Input value={expirations} onChange={(e) => setExpirations(e.target.value)} placeholder="Expirations (YYYY-MM-DD,comma)" />
        <Input value={strikes} onChange={(e) => setStrikes(e.target.value)} placeholder="Strikes (comma separated)" />
      </div>
      <div className="flex gap-3 mb-3">
        <Button className="luxury-btn" onClick={generate}>Generate Call Chain</Button>
      </div>

      {chain.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {chain.map((c) => (
            <div key={c.symbol} className="p-2 bg-[#071018] border border-[#10202a] rounded">
              <div className="font-semibold">{c.symbol}</div>
              <div className="text-xs text-slate-400">Exp: {c.expiration}</div>
              <div className="text-xs text-slate-400">Strike: {c.strike}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
