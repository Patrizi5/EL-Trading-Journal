import React, { useState } from 'react';

export default function NotesSystem({ initialNotes = [], onChange }) {
  const [notes, setNotes] = useState(initialNotes);
  const add = () => {
    setNotes([...notes, { id: Date.now(), text: '' }]);
  };
  const update = (id, text) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));
    onChange && onChange(notes);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={add} className="btn">
          Add Note
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <textarea
            key={n.id}
            value={n.text}
            onChange={(e) => update(n.id, e.target.value)}
            className="textarea"
          />
        ))}
      </div>
    </div>
  );
}
