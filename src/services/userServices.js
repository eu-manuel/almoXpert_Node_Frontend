const API_URL = "http://localhost:3000/api"; // URL do backend

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


export async function register(nome, email, senha) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro ao cadastrar");
  }

  return data;
}


