const API_URL = 'http://localhost:3000/api'; // URL do backend

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
