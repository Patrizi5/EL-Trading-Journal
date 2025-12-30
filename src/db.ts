import Dexie from 'dexie';
import { MarketKey } from './markets';

export interface ITrade {
  id?: string;
  market: MarketKey;
  symbol: string;
  side: 'long' | 'short';
  entry: number;
  exit?: number;
  size: number;
  pnl?: number;
  opened: Date;
  closed?: Date;
  psych?: {
    pre: { confidence: number; calm: number; clarity: number; energy: number; urgency: number; mindset: string[]; fear: string; rules: boolean };
    post?: { reaction: string; intensity: number; urge: boolean; urgeReason?: string; alignment: string; label?: string; pattern?: string };
  };
  notes?: string;
}

export class EternumDB extends Dexie {
  trades!: Dexie.Table<ITrade, string>;

  constructor() {
    super('Eternum');
    this.version(3).stores({
      trades: 'id, opened, market, symbol'
    });
  }
}

export const db = new EternumDB();

export async function getClosedTrades() {
  const all = await db.trades.toArray();
  return all
    .filter(t => t.exit !== undefined && t.pnl !== undefined)
    .map(t => ({ id: t.id!, date: t.opened.toISOString(), pnl: t.pnl! }));
}

export function calculateERS(psych?: ITrade['psych']): number {
  if (!psych?.pre) return 0;
  const p = psych.pre;
  return (p.urgency * 2) + ((5 - p.calm) * 2) + ((5 - p.clarity) * 1.5) + (p.energy > 3 ? 1 : 0);
}