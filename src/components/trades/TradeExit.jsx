import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DoorOpen, TrendingUp, TrendingDown } from 'lucide-react';

export default function TradeExit({ trade, open, onClose, onExit }) {
  const [exitData, setExitData] = useState({
    exit_price: '',
    exit_notes: '',
    emotion_exit: ''
  });

  if (!trade) return null;

  const calculatePL = () => {
    if (!exitData.exit_price) return null;
    const exit = parseFloat(exitData.exit_price);
    return trade.type === 'long' 
      ? (exit - trade.entry_price) * trade.quantity
      : (trade.entry_price - exit) * trade.quantity;
  };

  const pl = calculatePL();

  const handleExit = () => {
    onExit({
      ...exitData,
      exit_price: parseFloat(exitData.exit_price),
      exit_date: new Date().toISOString(),
      status: 'closed',
      profit_loss: pl,
      profit_loss_percent: pl ? (pl / (trade.entry_price * trade.quantity)) * 100 : 0
    });
    setExitData({ exit_price: '', exit_notes: '', emotion_exit: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            Exit Trade: {trade.symbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="text-slate-400 text-sm">Entry Price</p>
            <p className="text-white font-semibold text-lg">${trade.entry_price?.toFixed(2)}</p>
            <p className="text-slate-400 text-sm mt-1">{trade.quantity} @ {trade.type}</p>
          </div>

          <div>
            <Label className="text-slate-400">Exit Price</Label>
            <Input
              type="number"
              step="0.01"
              value={exitData.exit_price}
              onChange={(e) => setExitData({...exitData, exit_price: e.target.value})}
              placeholder="0.00"
              className="bg-slate-800 border-slate-700 mt-2"
              autoFocus
            />
          </div>

          {pl !== null && (
            <div className={`p-4 rounded-xl ${pl >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Estimated P&L</p>
                <div className="flex items-center gap-2">
                  {pl >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-rose-400" />}
                  <p className={`text-2xl font-bold ${pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="text-slate-400">Exit Notes</Label>
            <Textarea
              value={exitData.exit_notes}
              onChange={(e) => setExitData({...exitData, exit_notes: e.target.value})}
              placeholder="Why are you exiting? What did you learn?"
              className="bg-slate-800 border-slate-700 mt-2 h-24"
            />
          </div>

          <div>
            <Label className="text-slate-400">How do you feel?</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['satisfied', 'neutral', 'regret', 'relief', 'frustrated'].map(emotion => (
                <Button
                  key={emotion}
                  variant={exitData.emotion_exit === emotion ? "default" : "outline"}
                  size="sm"
                  className={exitData.emotion_exit === emotion ? 'bg-emerald-600' : 'border-slate-700'}
                  onClick={() => setExitData({...exitData, emotion_exit: emotion})}
                >
                  {emotion}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-700">Cancel</Button>
          <Button 
            onClick={handleExit}
            disabled={!exitData.exit_price}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Exit Trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
