import React from 'react';

export function Dialog({ open = true, children, onOpenChange }) {
}

export function DialogContent({ children, className = '' }) {
  return <div className={`bg-slate-900 text-white rounded p-4 max-w-full ${className}`}>{children}</div>;
}

export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children }) { return <h3 className="text-lg font-semibold">{children}</h3>; }
export function DialogFooter({ children, className = '' }) { return <div className={`mt-3 flex justify-end gap-2 ${className}`}>{children}</div>; }

// Re-export JSX implementation from .jsx to avoid JSX in this .js file
export { default, Dialog } from './dialog.jsx';
