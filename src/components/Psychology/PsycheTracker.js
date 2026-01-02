import React, { useState } from 'react';

export default function PsycheTracker({ initial = [] }) {
  const [entries, setEntries] = useState(initial);
  const add = () => setEntries([...entries, { id: Date.now(), mood: 'neutral' }]);

  return (
    <div className="space-y-2">
      <button onClick={add} className="btn">
        Add Entry
      </button>
      <div className="space-y-1">
        {entries.map((e) => (
          <div key={e.id} className="p-2 bg-slate-800 rounded">
            {e.mood}
          </div>
        ))}
      </div>
    </div>
  );
}
