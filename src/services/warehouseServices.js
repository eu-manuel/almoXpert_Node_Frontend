const API_URL = 'http://localhost:3000/api';

// Buscar almoxarifados do usuário logado (responsável)
export async function getMyWarehouses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar almoxarifados');
  return data;
}

// Buscar todos os almoxarifados
export async function getWarehouses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar almoxarifados');
  return data;
}

// Buscar almoxarifado por ID
export async function getWarehouseById(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar almoxarifado');
  return data;
}

// Criar almoxarifado
export async function createWarehouse(warehouse) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(warehouse),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar almoxarifado');
  return data;
}

// Atualizar almoxarifado
export async function updateWarehouse(id, warehouse) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(warehouse),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar almoxarifado');
  return data;
}

// Excluir almoxarifado
export async function deleteWarehouse(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao excluir almoxarifado');
  return data;
}

// Buscar estatísticas do almoxarifado (vínculos)
export async function getWarehouseStats(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/warehouse/${id}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar estatísticas');
  return data;
}
