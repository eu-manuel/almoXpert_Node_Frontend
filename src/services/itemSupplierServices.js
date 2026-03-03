const API_URL = 'http://localhost:3000/api'; // ajuste se necessário

// Listar vínculos item ↔ fornecedor (com filtro opcional)
// filters: { itemId: number, supplierId: number }
export async function getItemSuppliers(filters = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();

  if (filters.itemId) params.append('itemId', filters.itemId);
  if (filters.supplierId) params.append('supplierId', filters.supplierId);

  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_URL}/item-suppliers${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar vínculos item-fornecedor');
  return data;
}

// Criar vínculo item ↔ fornecedor
export async function createItemSupplier({ itemId, supplierId, preco, prazo_entrega }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-suppliers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemId, supplierId, preco, prazo_entrega }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao vincular fornecedor ao item');
  return data;
}

// Atualizar vínculo (preço, prazo)
export async function updateItemSupplier(id, { preco, prazo_entrega }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-suppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preco, prazo_entrega }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar vínculo');
  return data;
}

// Remover vínculo item ↔ fornecedor
export async function deleteItemSupplier(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/item-suppliers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao remover vínculo');
  return data;
}
