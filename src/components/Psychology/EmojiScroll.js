import React from 'react';

export default function EmojiScroll({ emojis = ['🙂', '😐', '😞'] }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {emojis.map((e, i) => (
        <div key={i} className="p-2 text-2xl">
          {e}
        </div>
      ))}
    </div>
  );
}
