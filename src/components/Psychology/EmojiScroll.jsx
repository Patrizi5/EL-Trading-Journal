import React from 'react';
import { Button } from "@/components/ui/button";

const EMOTION_EMOJIS = {
  confident: '😎',
  neutral: '😐',
  anxious: '😰',
  fomo: '🤯',
  revenge: '😤',
  fearful: '😨',
  greedy: '🤑',
  satisfied: '😊',
  regret: '😔',
  relief: '😮‍💨',
  frustrated: '😣',
  euphoric: '🤩',
  disappointed: '😞'
};

export default function EmojiScroll({ selected, onSelect, emotions }) {
  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map(emotion => (
        <Button
          key={emotion}
          variant={selected === emotion ? "default" : "outline"}
          className={`text-2xl h-12 w-12 p-0 ${selected === emotion ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-700 hover:bg-slate-800'}`}
          onClick={() => onSelect(emotion)}
          title={emotion}
        >
          {EMOTION_EMOJIS[emotion] || '🙂'}
        </Button>
      ))}
    </div>
  );
}
