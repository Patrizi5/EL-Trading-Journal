import React, { useState } from 'react';

export default function PositionCalculator({ onCalculate }) {
  const [risk, setRisk] = useState(1);
  const [entry, setEntry] = useState('');
  const [stop, setStop] = useState('');

  const calc = () => {
    const position = risk / (Math.abs(entry - stop) || 1);
    onCalculate && onCalculate(position);
  };

  return (
    <div className="space-y-2">
      <input
        value={entry}
        onChange={(e) => setEntry(Number(e.target.value))}
        placeholder="Entry"
        className="input"
      />
      <input
        value={stop}
        onChange={(e) => setStop(Number(e.target.value))}
        placeholder="Stop"
        className="input"
      />
      <input
        value={risk}
        onChange={(e) => setRisk(Number(e.target.value))}
        placeholder="Risk"
        className="input"
      />
      <div className="flex gap-2">
        <button onClick={calc} className="btn btn-primary">
          Calculate
        </button>
      </div>
    </div>
  );
}
