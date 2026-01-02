import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

export default function ExportCSV({ trades = [] }) {
  const exportToCSV = () => {
    const headers = [
      'Date',
      'Symbol',
      'Market Type',
      'Type',
      'Timeframe',
      'Entry Price',
      'Exit Price',
      'Quantity',
      'Stop Loss',
      'Take Profit',
      'Strategy',
      'P&L',
      'P&L %',
      'R Multiple',
      'Status',
      'Entry Emotion',
      'Exit Emotion',
      'Discipline Rating'
    ];

    const rows = trades.map(trade => [
      trade.entry_date ? format(new Date(trade.entry_date), 'yyyy-MM-dd HH:mm') : '',
      trade.symbol || '',
      trade.market_type || '',
      trade.type || '',
      trade.timeframe || '',
      trade.entry_price || '',
      trade.exit_price || '',
      trade.quantity || '',
      trade.stop_loss || '',
      trade.take_profit || '',
      trade.strategy || '',
      trade.profit_loss || '',
      trade.profit_loss_percent || '',
      trade.result_r || '',
      trade.status || '',
      trade.emotion_entry || '',
      trade.emotion_exit || '',
      trade.discipline_rating || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trades_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(trades, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trades_${format(new Date(), 'yyyy-MM-dd')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        variant="outline"
        className="border-slate-700"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      <Button
        onClick={exportToJSON}
        variant="outline"
        className="border-slate-700"
      >
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </Button>
    </div>
  );
}