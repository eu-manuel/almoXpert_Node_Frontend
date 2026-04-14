const API_URL = 'http://localhost:3000/api';

// ========================
// PROCESSOS
// ========================

// Listar todos os processos (filtros opcionais: status, id_almoxarifado)
export async function getProcessos(filters = {}) {
  const token = sessionStorage.getItem('token');
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.id_almoxarifado)
    params.append('id_almoxarifado', filters.id_almoxarifado);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URL}/processos${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar processos');
  return data;
}

// Buscar processo por ID (com itens, almoxarifado e usuário)
export async function getProcessoById(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar processo');
  return data;
}

// Criar processo (opcionalmente com array de itens)
export async function createProcesso(processo) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(processo),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar processo');
  return data;
}

// Atualizar processo
export async function updateProcesso(id, processo) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(processo),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar processo');
  return data;
}

// Deletar processo (cascata)
export async function deleteProcesso(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao remover processo');
  return data;
}

// Concluir processo (entrada de estoque)
export async function concluirProcesso(id, body) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos/${id}/concluir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao concluir processo');
  return data;
}

// Cancelar processo (sem movimentação de estoque)
export async function cancelarProcesso(id, body) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processos/${id}/cancelar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao cancelar processo');
  return data;
}
// ========================
// ITENS DO PROCESSO
// ========================

// Adicionar item a um processo
export async function addItemToProcesso(processoItem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processo-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(processoItem),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao adicionar item ao processo');
  return data;
}

// Atualizar item do processo (status, preço, quantidade)
export async function updateProcessoItem(id, processoItem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processo-items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(processoItem),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao atualizar item do processo');
  return data;
}

// Remover item do processo
export async function deleteProcessoItem(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/processo-items/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao remover item do processo');
  return data;
}
