import React from 'react';

export default function RecentTrades({ trades = [] }) {
  return (
    <div className="space-y-2">
      {trades.slice(0, 5).map((t) => (
        <div key={t.id} className="p-2 bg-slate-800 rounded">
          <div className="flex justify-between">
            <div>{t.symbol}</div>
            <div className="text-slate-400 text-sm">
              {t.qty} @ {t.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
