import React from 'react';

export default function StrategyBreakdown({ strategies = [] }) {
  return (
    <div className="space-y-2">
      {strategies.map((s) => (
        <div key={s.name} className="p-2 bg-slate-800 rounded flex justify-between">
          <div>{s.name}</div>
          <div className="text-slate-400">{s.perf}%</div>
        </div>
      ))}
    </div>
  );
}
