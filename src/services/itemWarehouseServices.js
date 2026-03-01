const API_URL = 'http://localhost:3000/api';

// Buscar itens de um almoxarifado específico (estoque)
export async function getItemsByWarehouse(warehouseId) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${API_URL}/item-warehouses?id_almoxarifado=${warehouseId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao buscar itens do almoxarifado');
  return data;
}

// Buscar todos os vínculos item-almoxarifado
export async function getAllItemWarehouses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-warehouses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao buscar vínculos item-almoxarifado');
  return data;
}

// Buscar vínculo específico por ID
export async function getItemWarehouseById(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-warehouses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar registro');
  return data;
}

// Criar vínculo item-almoxarifado (entrada de estoque)
export async function createItemWarehouse(itemWarehouse) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-warehouses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemWarehouse),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || 'Erro ao criar entrada de estoque');
  return data;
}

// Atualizar vínculo item-almoxarifado
export async function updateItemWarehouse(id, itemWarehouse) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-warehouses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemWarehouse),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar estoque');
  return data;
}

// Deletar vínculo item-almoxarifado
export async function deleteItemWarehouse(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-warehouses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao remover registro');
  return data;
}
