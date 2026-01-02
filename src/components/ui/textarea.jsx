import React from 'react';

export function Textarea(props) {
  return <textarea {...props} className={`rounded-md px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 ${props.className || ''}`} />;
}

export default Textarea;
