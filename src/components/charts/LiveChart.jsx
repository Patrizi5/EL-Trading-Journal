import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ExternalLink } from 'lucide-react';

export default function LiveChart({ symbol = 'AAPL', timeframe = '1D', marketType = 'stocks' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !symbol) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: getSymbolFormat(symbol, marketType),
          interval: timeframe,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0f172a',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: true,
          save_image: false,
          container_id: containerRef.current.id,
          backgroundColor: '#0f172a',
          gridColor: '#1e293b'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, timeframe, marketType]);

  const getSymbolFormat = (sym, type) => {
    switch(type) {
      case 'crypto':
        return `BINANCE:${sym.replace('/', '')}`;
      case 'forex':
        return `FX:${sym.replace('/', '')}`;
      default:
        return `NASDAQ:${sym}`;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-semibold">{symbol}</span>
          <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs capitalize">
            {marketType}
          </Badge>
        </div>
        <a 
          href={`https://www.tradingview.com/chart/?symbol=${getSymbolFormat(symbol, marketType)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <div 
        id={`tradingview_chart_${symbol}`} 
        ref={containerRef}
        className="h-[500px] rounded-lg overflow-hidden"
      />
    </Card>
  );
}
