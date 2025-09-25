// src/services/api.js

const API_URL = "http://localhost:3000/api"; // ou a URL do seu backend

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro ao fazer login");
  }

  // salvar token localmente
  localStorage.setItem("token", data.token);

  return data;
}
