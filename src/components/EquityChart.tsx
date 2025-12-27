import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Trade = { id: string; date: string; pnl: number };

export default function EquityChart({ trades }: { trades: Trade[] }) {
  const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let running = 0;
  const labels = sorted.map((_, i) => `T${i + 1}`);
  const dataPoints = sorted.map(t => (running += t.pnl, running));

  return (
    <div className="w-full h-64 mt-4">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Equity',
              data: dataPoints,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.1)',
              tension: 0.2,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
}