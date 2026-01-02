import React from 'react';

export default function PortfolioSummary({ portfolio }) {
  return (
    <div className="p-4 bg-slate-900 rounded">
      <div className="text-sm text-slate-400">Equity</div>
      <div className="text-2xl font-semibold">{portfolio?.equity || '$0'}</div>
    </div>
  );
}
