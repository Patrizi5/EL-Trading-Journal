import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

export default function PositionCalculator() {
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [direction, setDirection] = useState('long');

  const riskAmount = (parseFloat(accountSize) * parseFloat(riskPercent)) / 100;
  const riskPerShare = entryPrice && stopLoss ? Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss)) : 0;
  const positionSize = riskPerShare > 0 ? riskAmount / riskPerShare : 0;
  const positionValue = entryPrice ? positionSize * parseFloat(entryPrice) : 0;
  const rewardPerShare = entryPrice && takeProfit ? Math.abs(parseFloat(takeProfit) - parseFloat(entryPrice)) : 0;
  const potentialReward = rewardPerShare * positionSize;
  const riskRewardRatio = riskPerShare > 0 ? rewardPerShare / riskPerShare : 0;

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Position Size Calculator</h3>
          <p className="text-slate-400 text-sm">Calculate optimal position size based on risk</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-400 text-sm">Account Size ($)</Label>
            <Input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Risk per Trade (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-slate-400 text-sm">Direction</Label>
          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-slate-400 text-sm">Entry Price</Label>
            <Input
              type="number"
              step="0.01"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="0.00"
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Stop Loss</Label>
            <Input
              type="number"
              step="0.01"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="0.00"
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Take Profit</Label>
            <Input
              type="number"
              step="0.01"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="0.00"
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">Risk Amount</span>
            <span className="text-white font-semibold text-lg">${riskAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div>
              <span className="text-slate-400 block text-sm">Position Size</span>
              <span className="text-emerald-400 font-bold text-2xl">{positionSize.toFixed(2)}</span>
              <span className="text-slate-500 text-sm ml-2">shares</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-sm">Position Value</span>
              <span className="text-white font-semibold">${positionValue.toFixed(2)}</span>
            </div>
          </div>

          {riskPerShare > 0 && (
            <>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                <span className="text-slate-400">Risk per Share</span>
                <span className="text-rose-400 font-semibold">${riskPerShare.toFixed(2)}</span>
              </div>

              {takeProfit && (
                <>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                    <span className="text-slate-400">Potential Reward</span>
                    <span className="text-emerald-400 font-semibold">${potentialReward.toFixed(2)}</span>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl ${riskRewardRatio >= 2 ? 'bg-emerald-500/10 border border-emerald-500/20' : riskRewardRatio >= 1 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                    <div className="flex items-center gap-2">
                      {riskRewardRatio < 1 ? (
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      )}
                      <span className="text-slate-400">Risk : Reward Ratio</span>
                    </div>
                    <span className={`font-bold text-xl ${riskRewardRatio >= 2 ? 'text-emerald-400' : riskRewardRatio >= 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                      1 : {riskRewardRatio.toFixed(2)}
                    </span>
                  </div>

                  {riskRewardRatio < 1 && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <p className="text-rose-400 text-sm">⚠️ Risk/Reward ratio is less than 1:1. Consider adjusting your targets.</p>
                    </div>
                  )}
                  {riskRewardRatio >= 2 && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 text-sm">✓ Excellent risk/reward ratio! This meets the 2:1 minimum.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
