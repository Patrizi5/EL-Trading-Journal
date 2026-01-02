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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Loader2, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MARKET_TYPES = ['stocks', 'options', 'crypto', 'forex', 'futures', 'commodities'];
const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
const STRATEGIES = [
  'breakout',
  'momentum',
  'reversal',
  'scalp',
  'swing',
  'earnings',
  'news',
  'technical',
  'support_resistance',
  'trend_following',
  'mean_reversion',
  'other',
];
const EMOTIONS = {
  entry: ['confident', 'neutral', 'anxious', 'fomo', 'revenge', 'fearful', 'greedy'],
  exit: ['satisfied', 'neutral', 'regret', 'relief', 'frustrated', 'euphoric', 'disappointed'],
};

export default function TradeForm({ open, onClose, onSave, trade, isLoading }) {
  const [formData, setFormData] = useState({
    symbol: '',
    market_type: 'stocks',
    type: 'long',
    status: 'open',
    entry_price: '',
    exit_price: '',
    quantity: '',
    entry_date: new Date().toISOString().slice(0, 16),
    exit_date: '',
    timeframe: '1d',
    strategy: '',
    setup_notes: '',
    exit_notes: '',
    psychological_notes: '',
    emotion_entry: '',
    emotion_exit: '',
    discipline_rating: 3,
    risk_amount: '',
    stop_loss: '',
    take_profit: '',
    tags: [],
    screenshot_url: '',
    chart_image_url: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingChart, setUploadingChart] = useState(false);

  useEffect(() => {
    if (trade) {
      setFormData({
        ...trade,
        entry_price: trade.entry_price?.toString() || '',
        exit_price: trade.exit_price?.toString() || '',
        quantity: trade.quantity?.toString() || '',
        risk_amount: trade.risk_amount?.toString() || '',
        stop_loss: trade.stop_loss?.toString() || '',
        take_profit: trade.take_profit?.toString() || '',
        entry_date: trade.entry_date ? new Date(trade.entry_date).toISOString().slice(0, 16) : '',
        exit_date: trade.exit_date ? new Date(trade.exit_date).toISOString().slice(0, 16) : '',
        tags: trade.tags || [],
        discipline_rating: trade.discipline_rating || 3,
      });
    } else {
      setFormData({
        symbol: '',
        market_type: 'stocks',
        type: 'long',
        status: 'open',
        entry_price: '',
        exit_price: '',
        quantity: '',
        entry_date: new Date().toISOString().slice(0, 16),
        exit_date: '',
        timeframe: '1d',
        strategy: '',
        setup_notes: '',
        exit_notes: '',
        psychological_notes: '',
        emotion_entry: '',
        emotion_exit: '',
        discipline_rating: 3,
        risk_amount: '',
        stop_loss: '',
        take_profit: '',
        tags: [],
        screenshot_url: '',
        chart_image_url: '',
      });
    }
  }, [trade, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('screenshot_url', file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const handleChartUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingChart(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('chart_image_url', file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploadingChart(false);
  };

  const calculatePL = () => {
    const entry = parseFloat(formData.entry_price);
    const exit = parseFloat(formData.exit_price);
    const qty = parseFloat(formData.quantity);

    if (!entry || !exit || !qty) return null;

    const pl = formData.type === 'long' ? (exit - entry) * qty : (entry - exit) * qty;

    return pl;
  };

  const calculateResultR = () => {
    const pl = calculatePL();
    const risk = parseFloat(formData.risk_amount);
    if (pl && risk && risk > 0) {
      return pl / risk;
    }
    return null;
  };

  const handleSubmit = () => {
    const pl = calculatePL();
    const entry = parseFloat(formData.entry_price);
    const resultR = calculateResultR();

    const data = {
      ...formData,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : undefined,
      quantity: parseFloat(formData.quantity),
      risk_amount: formData.risk_amount ? parseFloat(formData.risk_amount) : undefined,
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : undefined,
      take_profit: formData.take_profit ? parseFloat(formData.take_profit) : undefined,
      profit_loss: pl,
      profit_loss_percent:
        pl && entry ? (pl / (entry * parseFloat(formData.quantity))) * 100 : undefined,
      result_r: resultR,
    };

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {trade ? 'Edit Trade' : 'New Trade Entry'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-slate-800 w-full grid grid-cols-4">
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
              Details
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-slate-700">
              Risk
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-slate-700">
              Notes
            </TabsTrigger>
            <TabsTrigger value="psychology" className="data-[state=active]:bg-slate-700">
              Psychology
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">Market / Symbol</Label>
                <Input
                  value={formData.symbol}
                  onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                  placeholder="AAPL, BTC/USD, EUR/USD"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Market Type</Label>
                <Select
                  value={formData.market_type}
                  onValueChange={(v) => handleChange('market_type', v)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {MARKET_TYPES.map((m) => (
                      <SelectItem key={m} value={m} className="capitalize">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">Direction</Label>
                <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(v) => handleChange('timeframe', v)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {TIMEFRAMES.map((tf) => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-400">Entry Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.entry_price}
                  onChange={(e) => handleChange('entry_price', e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Size / Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="100"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Strategy</Label>
                <Select
                  value={formData.strategy}
                  onValueChange={(v) => handleChange('strategy', v)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {STRATEGIES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">Entry Date / Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.entry_date}
                  onChange={(e) => handleChange('entry_date', e.target.value)}
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.status === 'closed' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Exit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.exit_price}
                      onChange={(e) => handleChange('exit_price', e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-800 border-slate-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400">Exit Date / Time</Label>
                    <Input
                      type="datetime-local"
                      value={formData.exit_date}
                      onChange={(e) => handleChange('exit_date', e.target.value)}
                      className="bg-slate-800 border-slate-700 mt-1"
                    />
                  </div>
                </div>

                {calculatePL() !== null && (
                  <div
                    className={`p-4 rounded-xl ${
                      calculatePL() >= 0
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-rose-500/10 border border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Result</p>
                        <p
                          className={`text-2xl font-bold ${
                            calculatePL() >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {calculatePL() >= 0 ? '+' : ''}${calculatePL().toFixed(2)}
                          {calculatePL() && formData.entry_price && (
                            <span className="text-lg ml-2">
                              (
                              {(
                                (calculatePL() /
                                  (parseFloat(formData.entry_price) *
                                    parseFloat(formData.quantity))) *
                                100
                              ).toFixed(2)}
                              %)
                            </span>
                          )}
                        </p>
                      </div>
                      {calculateResultR() !== null && (
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">R Multiple</p>
                          <p
                            className={`text-2xl font-bold ${
                              calculateResultR() >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {calculateResultR() >= 0 ? '+' : ''}
                            {calculateResultR().toFixed(2)}R
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-400">Stop Loss</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.stop_loss}
                  onChange={(e) => handleChange('stop_loss', e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Take Profit</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.take_profit}
                  onChange={(e) => handleChange('take_profit', e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-400">Risk Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.risk_amount}
                  onChange={(e) => handleChange('risk_amount', e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 mt-1"
                />
              </div>
            </div>

            {formData.entry_price && formData.stop_loss && formData.quantity && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-slate-400 text-sm mb-2">Risk Calculation</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Risk per share</p>
                    <p className="text-blue-400 font-semibold">
                      $
                      {Math.abs(
                        parseFloat(formData.entry_price) - parseFloat(formData.stop_loss)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total risk</p>
                    <p className="text-blue-400 font-semibold">
                      $
                      {(
                        Math.abs(
                          parseFloat(formData.entry_price) - parseFloat(formData.stop_loss)
                        ) * parseFloat(formData.quantity)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Risk/Reward</p>
                    <p className="text-blue-400 font-semibold">
                      {formData.take_profit
                        ? `1:${(
                            Math.abs(
                              parseFloat(formData.take_profit) - parseFloat(formData.entry_price)
                            ) /
                            Math.abs(
                              parseFloat(formData.entry_price) - parseFloat(formData.stop_loss)
                            )
                          ).toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400">Setup Notes</Label>
              <p className="text-slate-500 text-xs mb-2">What was your analysis? Why enter?</p>
              <Textarea
                value={formData.setup_notes}
                onChange={(e) => handleChange('setup_notes', e.target.value)}
                placeholder="Market context, technical analysis, why you entered..."
                className="bg-slate-800 border-slate-700 mt-1 h-32"
              />
            </div>

            <div>
              <Label className="text-slate-400">Exit Notes / Lessons Learned</Label>
              <p className="text-slate-500 text-xs mb-2">What happened? What could improve?</p>
              <Textarea
                value={formData.exit_notes}
                onChange={(e) => handleChange('exit_notes', e.target.value)}
                placeholder="Exit reasoning, what worked, what didn't..."
                className="bg-slate-800 border-slate-700 mt-1 h-32"
              />
            </div>

            <div>
              <Label className="text-slate-400">Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="bg-slate-800 border-slate-700"
                />
                <Button onClick={addTag} variant="outline" className="border-slate-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                    {tag}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">Entry Chart</Label>
                <div className="mt-1">
                  {formData.screenshot_url ? (
                    <div className="relative">
                      <img
                        src={formData.screenshot_url}
                        alt="Entry Chart"
                        className="rounded-lg max-h-40 object-cover w-full"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleChange('screenshot_url', '')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-slate-400">Exit Chart</Label>
                <div className="mt-1">
                  {formData.chart_image_url ? (
                    <div className="relative">
                      <img
                        src={formData.chart_image_url}
                        alt="Exit Chart"
                        className="rounded-lg max-h-40 object-cover w-full"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleChange('chart_image_url', '')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                      {uploadingChart ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChartUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="psychology" className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400">Psychological Analysis</Label>
              <p className="text-slate-500 text-xs mb-2">
                Deep dive into your mental state and decision-making
              </p>
              <Textarea
                value={formData.psychological_notes}
                onChange={(e) => handleChange('psychological_notes', e.target.value)}
                placeholder="How were you feeling? Any biases? Stress levels? Did you follow your plan? What influenced your decisions?"
                className="bg-slate-800 border-slate-700 mt-1 h-40"
              />
            </div>

            <div>
              <Label className="text-slate-400">Entry Emotion</Label>
              <p className="text-slate-500 text-xs mb-2">How did you feel entering?</p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.entry.map((emotion) => (
                  <Button
                    key={emotion}
                    variant={formData.emotion_entry === emotion ? 'default' : 'outline'}
                    className={`capitalize ${
                      formData.emotion_entry === emotion
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'border-slate-700'
                    }`}
                    onClick={() => handleChange('emotion_entry', emotion)}
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-400">Exit Emotion</Label>
              <p className="text-slate-500 text-xs mb-2">How did you feel after closing?</p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.exit.map((emotion) => (
                  <Button
                    key={emotion}
                    variant={formData.emotion_exit === emotion ? 'default' : 'outline'}
                    className={`capitalize ${
                      formData.emotion_exit === emotion
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'border-slate-700'
                    }`}
                    onClick={() => handleChange('emotion_exit', emotion)}
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-400">Discipline Rating</Label>
              <p className="text-slate-500 text-xs mb-2">
                How well did you follow your trading plan? (1 = Poor, 5 = Perfect)
              </p>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={formData.discipline_rating === rating ? 'default' : 'outline'}
                    className={`flex-1 ${
                      formData.discipline_rating === rating
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'border-slate-700'
                    }`}
                    onClick={() => handleChange('discipline_rating', rating)}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        formData.discipline_rating >= rating ? 'fill-current' : ''
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="border-slate-700">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.symbol || !formData.entry_price || !formData.quantity || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : trade ? (
              'Update Trade'
            ) : (
              'Save Trade'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
