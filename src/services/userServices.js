import { API_URL } from './api';

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erro ao fazer login');
  }

  // salvar token localmente
  sessionStorage.setItem('token', data.token);

  return data;
}

export async function getMe() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar usuário');
  return data;
}

export async function updateProfile(profileData) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar perfil');
  return data;
}

export async function deactivateAccount() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao desativar conta');
  return data;
}
