import { useState } from 'react';

interface Props {
  onSelect: (mood: number) => void;
}

export default function PsycheTracker({ onSelect }: Props) {
  const moods = ['😡', '😕', '😐', '🙂', '😁'];
  return (
    <div className="flex gap-2">
      {moods.map((m, i) => (
        <button
          key={i}
          className="text-2xl hover:bg-gray-700 p-1 rounded"
          onClick={() => onSelect(i + 1)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
