import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Semana 1', estoque: 20 },
  { name: 'Semana 2', estoque: 115 },
  { name: 'Semana 3', estoque: 430 },
  { name: 'Semana 4', estoque: 125 },
  { name: 'Semana 5', estoque: 240 },
  { name: 'Semana 6', estoque: 235 },
  { name: 'Semana 7', estoque: 150 },
  { name: 'Semana 8', estoque: 425 },
];

export default function LineChartComponent() {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="estoque"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
