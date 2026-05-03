import { API_URL } from './api';

// Buscar todas as estatísticas do dashboard
export async function getDashboardStats() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar dados do dashboard');
  return data;
}
