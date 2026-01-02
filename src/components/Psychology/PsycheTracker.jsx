import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Star, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PsycheTracker({ trades = [] }) {
  const closedTrades = trades.filter(t => t.status === 'closed');
  
  const avgDiscipline = closedTrades.reduce((sum, t) => sum + (t.discipline_rating || 0), 0) / (closedTrades.length || 1);
  
  const emotionalPatterns = closedTrades.reduce((acc, trade) => {
    const key = `${trade.emotion_entry}-${(trade.profit_loss || 0) > 0 ? 'win' : 'loss'}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topPattern = Object.entries(emotionalPatterns)
    .sort((a, b) => b[1] - a[1])[0];

  const disciplineIssues = closedTrades.filter(t => (t.discipline_rating || 0) < 3).length;
  const emotionalTrades = closedTrades.filter(t => ['fomo', 'revenge', 'greedy'].includes(t.emotion_entry)).length;

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Psychology Tracker</h3>
          <p className="text-slate-400 text-sm">Mental game insights</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Average Discipline</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i <= avgDiscipline ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{avgDiscipline.toFixed(1)}/5</p>
        </div>

        {disciplineIssues > 0 && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <p className="text-rose-400 font-medium">Discipline Alert</p>
            </div>
            <p className="text-slate-400 text-sm">
              {disciplineIssues} trades with poor discipline (rating &lt; 3)
            </p>
          </div>
        )}

        {emotionalTrades > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 font-medium">Emotional Trading</p>
            </div>
            <p className="text-slate-400 text-sm">
              {emotionalTrades} trades driven by FOMO, revenge, or greed
            </p>
          </div>
        )}

        {topPattern && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <p className="text-blue-400 font-medium">Most Common Pattern</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-500/20 text-blue-400 capitalize">
                {topPattern[0].split('-')[0]}
              </Badge>
              <span className="text-slate-400 text-sm">
                → {topPattern[0].split('-')[1]} ({topPattern[1]} times)
              </span>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-800/50">
          <p className="text-slate-400 text-sm mb-2">Pro Tips</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Track emotions before entering every trade</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Avoid trading when feeling FOMO or revenge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Review discipline ratings weekly</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
