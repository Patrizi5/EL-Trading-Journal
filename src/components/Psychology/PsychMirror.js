import React from 'react';

export default function PsychMirror({ text }) {
  return <div className="p-3 bg-slate-900 rounded">{text || 'No reflection yet'}</div>;
}
