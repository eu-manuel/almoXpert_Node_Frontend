const API_URL = 'http://localhost:3000/api';

/**
 * Listar relatórios disponíveis.
 * @returns {Promise<Array<{tipo: string, titulo: string}>>}
 */
export async function listReports() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao listar relatórios');
  return data;
}

/**
 * Gerar relatório em formato JSON (pré-visualização).
 * @param {string} tipo - Tipo do relatório (ex: 'posicao-estoque')
 * @param {Object} filters - Filtros aplicados
 * @returns {Promise<{titulo: string, filtros: Object, dados: Array, resumo: Object}>}
 */
export async function getReportData(tipo, filters = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ formato: 'json', ...filters });

  const res = await fetch(`${API_URL}/reports/${tipo}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao gerar relatório');
  return data;
}

/**
 * Exportar relatório em PDF ou Excel (download do arquivo).
 * @param {string} tipo - Tipo do relatório
 * @param {'pdf'|'excel'} formato - Formato de exportação
 * @param {Object} filters - Filtros aplicados
 */
export async function exportReport(tipo, formato, filters = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ formato, ...filters });

  const res = await fetch(`${API_URL}/reports/${tipo}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Erro ao exportar relatório');
  }

  // Fazer download do arquivo
  const blob = await res.blob();
  const ext = formato === 'pdf' ? 'pdf' : 'xlsx';
  const filename = `${tipo}_${new Date().toISOString().slice(0, 10)}.${ext}`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
