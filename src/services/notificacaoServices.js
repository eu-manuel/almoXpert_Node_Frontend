import { API_URL } from './api';

// Listar notificações do usuário logado
export async function getNotificacoes() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/notificacoes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar notificações');
  return data;
}

// Contar notificações não lidas
export async function contarNaoLidas() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/notificacoes/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao contar notificações');
  return data;
}

// Marcar uma notificação como lida
export async function marcarComoLida(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/notificacoes/${id}/lida`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao marcar como lida');
  return data;
}

// Marcar todas como lidas
export async function marcarTodasComoLidas() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/notificacoes/marcar-todas`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao marcar notificações');
  return data;
}
