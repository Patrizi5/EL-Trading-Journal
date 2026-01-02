import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function WatchlistForm({ open, onClose, onSave, item, isLoading }) {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    target_price: '',
    notes: '',
    alert_above: '',
    alert_below: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        symbol: item.symbol || '',
        name: item.name || '',
        target_price: item.target_price?.toString() || '',
        notes: item.notes || '',
        alert_above: item.alert_above?.toString() || '',
        alert_below: item.alert_below?.toString() || '',
        priority: item.priority || 'medium',
      });
    } else {
      setFormData({
        symbol: '',
        name: '',
        target_price: '',
        notes: '',
        alert_above: '',
        alert_below: '',
        priority: 'medium',
      });
    }
  }, [item, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      target_price: formData.target_price ? parseFloat(formData.target_price) : undefined,
      alert_above: formData.alert_above ? parseFloat(formData.alert_above) : undefined,
      alert_below: formData.alert_below ? parseFloat(formData.alert_below) : undefined,
    };
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {item ? 'Edit Watchlist Item' : 'Add to Watchlist'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400">Symbol</Label>
              <Input
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                placeholder="AAPL"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-400">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-slate-400">Company Name (optional)</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Apple Inc."
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-400">Target Price</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.target_price}
              onChange={(e) => handleChange('target_price', e.target.value)}
              placeholder="0.00"
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400">Alert Above</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.alert_above}
                onChange={(e) => handleChange('alert_above', e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-400">Alert Below</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.alert_below}
                onChange={(e) => handleChange('alert_below', e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-400">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Why are you watching this stock?"
              className="bg-slate-800 border-slate-700 mt-1 h-24"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="border-slate-700">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.symbol || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : item ? (
              'Update'
            ) : (
              'Add to Watchlist'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
