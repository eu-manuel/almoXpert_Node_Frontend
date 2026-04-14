const API_URL = 'http://localhost:3000/api';

// Buscar todas as categorias (com filtro opcional)
export async function getCategories(query = '') {
  const token = sessionStorage.getItem('token');
  const url = query
    ? `${API_URL}/category?q=${encodeURIComponent(query)}`
    : `${API_URL}/category`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar categorias');
  return data;
}

// Buscar categorias com filtro por nome (alias para autocomplete)
export async function searchCategories(query) {
  return getCategories(query);
}

// Buscar ou criar categoria por nome
export async function findOrCreateCategory(nome) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/category/find-or-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar/criar categoria');
  return data;
}

// Buscar categoria por ID
export async function getCategoryById(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/category/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar categoria');
  return data;
}

// Criar categoria
export async function createCategory(category) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar categoria');
  return data;
}
