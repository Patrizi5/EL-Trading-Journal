import React from 'react';

export function Badge({ children, className = '', _variant }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded ${className}`}>{children}</span>;
}

export default Badge;
