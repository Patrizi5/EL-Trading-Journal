import React from 'react';

export function Button({ children, className = '', variant = 'default', _size, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium';
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border border-slate-700 text-slate-200 hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-800',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700'
  };
  return (
    <button className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
