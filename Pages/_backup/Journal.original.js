import React from 'react';
import NotesSystem from '@/components/notes/NotesSystem';

export default function Journal() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Journal</h2>
      <NotesSystem />
    </div>
  );
}
