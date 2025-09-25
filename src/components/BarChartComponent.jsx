import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Janeiro", vendas: 4210 },
  { name: "Fevereiro", vendas: 3806 },
  { name: "Março", vendas: 5060 },
  { name: "Abril", vendas: 4530 },
  { name: "Maio", vendas: 5450 },
  { name: "Junho", vendas: 5320 },
  { name: "Julho", vendas: 6070 },
  { name: "Agosto", vendas: 5520 },
  { name: "Setembro", vendas: 6420 },
  { name: "Outubro", vendas: 5830 },
  { name: "Novembro", vendas: 6510 },
  { name: "Dezembro", vendas: 7060 },


];

export default function BarChartComponent() {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="vendas" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
