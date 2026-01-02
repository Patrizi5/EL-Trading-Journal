import React from 'react';

export function Label({ children, className = '' }) {
  return <label className={`text-sm text-slate-400 ${className}`}>{children}</label>;
}

export default Label;
