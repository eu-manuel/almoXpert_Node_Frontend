import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Ativo", value: 420 },
  { name: "Inativo", value: 80 },
  { name: "Em manutenção", value: 50 },
  { name: "Esgotado", value: 30 },
];

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function PieChartComponent() {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
