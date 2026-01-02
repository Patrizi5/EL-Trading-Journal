import React from 'react';
import { db } from '../db';

export function ExportCSV() {
  const isPro = localStorage.getItem('pro') === '1';

  const downloadCSV = async () => {
    const trades = await db.trades.toArray();
    const rows = [
      [
        'ID',
        'Market',
        'Symbol',
        'Side',
        'Entry',
        'Exit',
        'Size',
        'PnL',
        'Confidence',
        'Calm',
        'Urgency',
        'Notes',
      ],
      ...trades.map((t) => [
        t.id,
        t.market,
        t.symbol,
        t.side,
        t.entry,
        t.exit || '',
        t.size,
        t.pnl || 0,
        t.psych?.pre.confidence || '',
        t.psych?.pre.calm || '',
        t.psych?.pre.urgency || '',
        `"${(t.notes || '').replace(/"/g, '""')}"`,
      ]),
    ];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `eternum-trades-${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const unlock = () => {
    window.open('https://gumroad.com/l/eternum-pro/29', '_blank');
    localStorage.setItem('pro', '1');
  };

  return (
    <button
      onClick={isPro ? downloadCSV : unlock}
      className="bg-blue-600 px-3 py-1 rounded text-white"
    >
      {isPro ? 'Export CSV' : 'Export CSV (Pro - $29)'}
    </button>
  );
}
