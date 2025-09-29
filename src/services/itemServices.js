const API_URL = "http://localhost:3000/api";

// Buscar todos os itens
export async function getItems() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar itens");
  return data;
}

// Criar item
export async function createItem(item) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao criar item");
  return data;
}

// Atualizar item
export async function updateItem(id, item) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar item");
  return data;
}

// Excluir item
export async function deleteItem(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao excluir item");
  return data;
}

// Buscar item por ID
export async function getItemById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar item");
  return data;
}
