import React from 'react';

export function Switch({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange && onChange(e.target.checked)} className="sr-only" />
      <span className={`w-10 h-5 bg-slate-700 rounded-full relative ${checked ? 'bg-emerald-600' : ''}`}>
        <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </label>
  );
}

export default Switch;
