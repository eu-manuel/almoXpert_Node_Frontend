import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Typography, Box } from '@mui/material';

const COLORS = [
  '#16a34a', '#6366f1', '#f59e0b', '#ef4444',
  '#3b82f6', '#ec4899', '#14b8a6', '#a855f7',
  '#f97316', '#06b6d4', '#84cc16', '#e11d48',
];

/**
 * Gráfico de pizza — Itens por Categoria.
 *
 * Props:
 *  - data: [{ nome: 'Eletrônicos', quantidade: 42 }, ...]
 *          (array retornado por /api/dashboard/stats → itensPorCategoria)
 */
export default function PieChartComponent({ data = [] }) {
  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          Sem dados de categorias
        </Typography>
      </Box>
    );
  }

  // Mapeia para o formato esperado pelo Recharts
  const chartData = data.map((d) => ({ name: d.nome, value: d.quantidade }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={45}
          paddingAngle={3}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          labelLine={{ stroke: '#888' }}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#2a2a3d',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            color: '#fff',
          }}
          formatter={(value) => [value, 'Itens']}
        />
        <Legend
          wrapperStyle={{ color: '#ccc', fontSize: 12 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
