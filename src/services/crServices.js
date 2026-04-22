const API_URL = 'http://localhost:3000/api';

// Listar todos os CRs (com usuários vinculados)
export async function getCRs() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar CRs');
  return data;
}

// Retornar os CRs do usuário logado
export async function getMeusCRs() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade/user/meus-crs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar meus CRs');
  return data;
}

// Buscar CR por ID
export async function getCRById(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar CR');
  return data;
}

// Criar novo CR
export async function createCR(cr) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cr),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar CR');
  return data;
}

// Atualizar CR
export async function updateCR(id, cr) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cr),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar CR');
  return data;
}

// Deletar CR
export async function deleteCR(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/centros-responsabilidade/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao remover CR');
  return data;
}

// Vincular usuário a um CR
export async function vincularUsuario(crId, userId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(
    `${API_URL}/centros-responsabilidade/${crId}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_usuario: userId }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao vincular usuário');
  return data;
}

// Desvincular usuário de um CR
export async function desvincularUsuario(crId, userId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(
    `${API_URL}/centros-responsabilidade/${crId}/users/${userId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao desvincular usuário');
  return data;
}
