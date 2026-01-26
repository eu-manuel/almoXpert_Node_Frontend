const API_URL = 'http://localhost:3000/api'; // ajuste se necessário

// Buscar todos os fornecedores
export async function getSuppliers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/supplier`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar fornecedores');
  return data;
}

// Criar fornecedor
export async function createSupplier(supplier) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/supplier`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplier),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar fornecedor');
  return data;
}

// Atualizar fornecedor
export async function updateSupplier(id, supplier) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/supplier/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplier),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar fornecedor');
  return data;
}

// Excluir fornecedor
export async function deleteSupplier(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/supplier/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao excluir fornecedor');
  return data;
}
