import { API_URL } from './api';

/**
 * Listar todas as categorias de um item
 * @param {number} itemId - ID do item
 * @returns {Promise<Array>} Lista de categorias do item
 */
export async function getItemCategories(itemId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/items/${itemId}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erro ao buscar categorias do item');
  }
  return data;
}

/**
 * Adicionar uma categoria a um item
 * @param {number} itemId - ID do item
 * @param {number} categoriaId - ID da categoria a adicionar
 * @returns {Promise<Object>} Item atualizado com todas as categorias
 */
export async function addCategoryToItem(itemId, categoriaId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/items/${itemId}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoria_id: categoriaId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erro ao adicionar categoria ao item');
  }
  return data;
}

/**
 * Remover uma categoria de um item
 * @param {number} itemId - ID do item
 * @param {number} categoriaId - ID da categoria a remover
 * @returns {Promise<Object>} Item atualizado com categorias restantes
 */
export async function removeCategoryFromItem(itemId, categoriaId) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/items/${itemId}/categories/${categoriaId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erro ao remover categoria do item');
  }
  return data;
}
