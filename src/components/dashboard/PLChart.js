import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PLChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area dataKey="pnl" stroke="#06b6d4" fill="#134e4a" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
