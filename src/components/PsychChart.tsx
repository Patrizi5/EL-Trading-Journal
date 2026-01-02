import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  trades: Array<{ ers: number; pnl: number }>;
}

export default function PsychChart({ trades }: Props) {
  const data = trades.map((t) => ({ x: t.ers, y: t.pnl }));
  return (
    <div className="w-full h-64 mt-4 bg-gray-900 p-2 rounded">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" dataKey="x" name="ERS" stroke="#fff" />
          <YAxis type="number" dataKey="y" name="P&L" stroke="#fff" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="#10b981" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
