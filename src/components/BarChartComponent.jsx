import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Typography, Box } from '@mui/material';

/**
 * Gráfico de barras agrupadas — Entradas vs Saídas por mês.
 *
 * Props:
 *  - data: [{ mes: 'Jan/26', entradas: 120, saidas: 80 }, ...]
 *          (array retornado por /api/dashboard/stats → movimentacoesPorMes)
 */
export default function BarChartComponent({ data = [] }) {
  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          Sem dados de movimentação
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="mes" tick={{ fill: '#ccc', fontSize: 12 }} />
        <YAxis tick={{ fill: '#ccc', fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#2a2a3d',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            color: '#fff',
          }}
        />
        <Legend wrapperStyle={{ color: '#ccc', fontSize: 13 }} />
        <Bar dataKey="entradas" name="Entradas" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="saidas" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
