const API_URL = 'http://localhost:3000/api';

// Criar ticket
export async function createTicket(ticket) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticket),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar ticket');
  return data;
}

// Listar todos os tickets (com filtros opcionais)
export async function getTickets(filters = {}) {
  const token = sessionStorage.getItem('token');
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.cr_id) params.append('cr_id', filters.cr_id);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URL}/tickets${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar tickets');
  return data;
}

// Buscar ticket por ID
export async function getTicketById(id) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar ticket');
  return data;
}

// Listar meus tickets (solicitante)
export async function getMeusTickets(filters = {}) {
  const token = sessionStorage.getItem('token');
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.tipo) params.append('tipo', filters.tipo);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URL}/tickets/meus-tickets${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar meus tickets');
  return data;
}

// Fila de atendimento (atendente)
export async function getFilaAtendimento(filters = {}) {
  const token = sessionStorage.getItem('token');
  const params = new URLSearchParams();
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.cr_id) params.append('cr_id', filters.cr_id);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(
    `${API_URL}/tickets/fila-atendimento${queryString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar fila de atendimento');
  return data;
}

// Editar ticket
export async function updateTicket(id, ticket) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticket),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar ticket');
  return data;
}

// Enviar para validação
export async function enviarParaValidacao(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/enviar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao enviar ticket');
  return data;
}

// Aprovar ticket
export async function aprovarTicket(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/aprovar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao aprovar ticket');
  return data;
}

// Recusar ticket
export async function recusarTicket(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/recusar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao recusar ticket');
  return data;
}

// Cancelar ticket
export async function cancelarTicket(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/cancelar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao cancelar ticket');
  return data;
}

// Aguardar conclusão (emergência)
export async function aguardarConclusao(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/aguardar-conclusao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao marcar ticket');
  return data;
}

// Adicionar mensagem ao ticket
export async function addMensagem(id, mensagem) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/tickets/${id}/mensagens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem');
  return data;
}
