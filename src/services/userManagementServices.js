import { API_URL } from './api';

// =============================================
// Usuários — CRUD
// =============================================

// Listar todos os usuários (com permissões incluídas)
export async function getUsers() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar usuários');
  return data;
}

// Buscar usuário por ID (com permissões incluídas)
export async function getUserById(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar usuário');
  return data;
}

// Criar novo usuário
export async function createUser(userData) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar usuário');
  return data;
}

// Atualizar usuário existente
export async function updateUser(id, userData) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar usuário');
  return data;
}

// Excluir usuário permanentemente
export async function deleteUser(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao excluir usuário');
  return data;
}

// Desativar usuário (ativo = false)
export async function deactivateUser(id) {
  return updateUser(id, { ativo: false });
}

// Reativar usuário (ativo = true)
export async function reactivateUser(id) {
  return updateUser(id, { ativo: true });
}

// =============================================
// Permissões — Lista de permissões disponíveis
// =============================================

// Listar todas as permissões do sistema
export async function getPermissions() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar permissões');
  return data;
}

// =============================================
// Permissões do Usuário — Atribuir e Revogar
// =============================================

// Buscar permissões de um usuário específico
export async function getUserPermissions(userId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/user-permissions/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao buscar permissões do usuário');
  return data;
}

// Conceder permissão a um usuário
export async function grantPermission(userId, permissionId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/user-permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_usuario: userId,
      id_permissao: permissionId,
    }),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao conceder permissão');
  return data;
}

// Revogar permissão de um usuário
export async function revokePermission(userId, permissionId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/user-permissions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_usuario: userId,
      id_permissao: permissionId,
    }),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao revogar permissão');
  return data;
}
