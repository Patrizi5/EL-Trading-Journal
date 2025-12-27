import Dexie from 'dexie';

export interface ITrade {
  id?: string;
  market: string;
  side: 'long' | 'short';
  entry: number;
  exit?: number;
  size: number;
  pnl?: number;
  opened: Date;
  closed?: Date;
}

export class EternumDB extends Dexie {
  trades!: Dexie.Table<ITrade, string>;

  constructor() {
    super('Eternum');
    this.version(1).stores({
      trades: 'id, opened'
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