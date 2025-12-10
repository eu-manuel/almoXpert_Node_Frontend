const API_URL = "http://localhost:3000/api";

// Buscar todas as movimentações
export async function getMovements() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/moviment`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar movimentações");
  return data;
}

// Criar movimentação
export async function createMovement(movement) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/moviment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movement),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao criar movimentação");
  return data;
}

// Atualizar movimentação
export async function updateMovement(id, movement) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/moviment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movement),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar movimentação");
  return data;
}

// Excluir movimentação
export async function deleteMovement(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/moviment/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao excluir movimentação");
  return data;
}
