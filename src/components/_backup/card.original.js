import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`rounded-md p-3 bg-slate-900 border border-slate-800 ${className}`}>{children}</div>;
}

export default Card;
