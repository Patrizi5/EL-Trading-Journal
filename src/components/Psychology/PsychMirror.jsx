import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

export default function PsychMirror({ onSave }) {
  const [reflection, setReflection] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    content: '',
    type: 'daily'
  });

  const prompts = [
    "What emotions influenced my trading today?",
    "Did I follow my trading plan?",
    "What could I have done better?",
    "What did I learn from today's trades?",
    "How did I manage my risk today?"
  ];

  const handleSave = () => {
    onSave?.(reflection);
    setReflection({ date: format(new Date(), 'yyyy-MM-dd'), content: '', type: 'daily' });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Eye className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Trading Reflection</h3>
          <p className="text-slate-400 text-sm">Daily psychological review</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <p className="text-indigo-400 font-medium text-sm">Reflection Prompts</p>
          </div>
          <ul className="space-y-2">
            {prompts.map((prompt, i) => (
              <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                {prompt}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Textarea
            value={reflection.content}
            onChange={(e) => setReflection({ ...reflection, content: e.target.value })}
            placeholder="Write your reflections here... What went well? What could be improved? How did you feel?"
            className="bg-slate-800 border-slate-700 min-h-[200px]"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!reflection.content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Reflection
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/50">
          <p className="text-slate-400 text-xs mb-2">Why reflect?</p>
          <p className="text-slate-500 text-sm">
            Daily reflections help identify patterns, improve discipline, and develop a winning mindset. 
            Top traders spend as much time reviewing as they do trading.
          </p>
        </div>
      </div>
    </Card>
  );
}
