/**
 * ReportFilters — Painel de filtros dinâmicos por relatório.
 *
 * Carrega automaticamente as opções dos selects (categorias, almoxarifados,
 * fornecedores, itens, usuários) e renderiza os campos conforme o relatório.
 *
 * Props:
 *  - reportType: string         — tipo do relatório selecionado
 *  - filters: Object            — valores atuais dos filtros
 *  - onChange: (filters) => void — callback quando um filtro muda
 *  - onGenerate: () => void     — callback ao clicar "Gerar Relatório"
 *  - loading: boolean           — estado de carregamento
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ClearAllIcon from '@mui/icons-material/ClearAll';

/* ───── Mapa de filtros por relatório ───── */
const REPORT_FILTERS = {
  'posicao-estoque': [
    { name: 'id_categoria', label: 'Categoria', type: 'select', source: 'categories' },
    { name: 'id_almoxarifado', label: 'Almoxarifado', type: 'select', source: 'warehouses' },
    { name: 'id_fornecedor', label: 'Fornecedor', type: 'select', source: 'suppliers' },
    { name: 'valor_min', label: 'Valor mínimo (R$)', type: 'number' },
    { name: 'valor_max', label: 'Valor máximo (R$)', type: 'number' },
  ],
  'estoque-minimo': [
    { name: 'id_categoria', label: 'Categoria', type: 'select', source: 'categories' },
    { name: 'id_fornecedor', label: 'Fornecedor', type: 'select', source: 'suppliers' },
    { name: 'id_almoxarifado', label: 'Almoxarifado', type: 'select', source: 'warehouses' },
    {
      name: 'urgencia', label: 'Urgência mínima', type: 'select',
      options: [
        { value: 'baixo', label: '🟢 Baixo' },
        { value: 'medio', label: '🟡 Médio' },
        { value: 'alto', label: '🟠 Alto' },
        { value: 'critico', label: '🔴 Crítico' },
      ],
    },
  ],
  'curva-abc': [
    { name: 'data_inicio', label: 'Data Início', type: 'date' },
    { name: 'data_fim', label: 'Data Fim', type: 'date' },
    { name: 'id_categoria', label: 'Categoria', type: 'select', source: 'categories' },
  ],
  'movimentacoes': [
    { name: 'data_inicio', label: 'Data Início', type: 'date' },
    { name: 'data_fim', label: 'Data Fim', type: 'date' },
    {
      name: 'tipo', label: 'Tipo', type: 'select',
      options: [
        { value: 'entrada', label: 'Entrada' },
        { value: 'saida', label: 'Saída' },
        { value: 'transferencia', label: 'Transferência' },
        { value: 'ajuste', label: 'Ajuste' },
      ],
    },
    { name: 'id_item', label: 'Item', type: 'select', source: 'items' },
    { name: 'id_almoxarifado', label: 'Almoxarifado', type: 'select', source: 'warehouses' },
    { name: 'id_usuario', label: 'Usuário', type: 'select', source: 'users' },
  ],
  'estoque-parado': [
    {
      name: 'dias_inatividade', label: 'Dias de inatividade', type: 'select',
      options: [
        { value: '30', label: '30 dias' },
        { value: '60', label: '60 dias' },
        { value: '90', label: '90 dias' },
        { value: '180', label: '180 dias' },
      ],
    },
    { name: 'id_categoria', label: 'Categoria', type: 'select', source: 'categories' },
    { name: 'valor_min', label: 'Valor mínimo parado (R$)', type: 'number' },
  ],
};

/* ───── Funções para carregar opções dos selects ───── */
const API_URL = 'http://localhost:3000/api';

async function fetchOptions(source) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  switch (source) {
    case 'categories': {
      const res = await fetch(`${API_URL}/category`, { headers });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((c) => ({
        value: c.id_categoria,
        label: c.nome,
      }));
    }
    case 'warehouses': {
      const res = await fetch(`${API_URL}/warehouse`, { headers });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((w) => ({
        value: w.id_almoxarifado,
        label: w.nome,
      }));
    }
    case 'suppliers': {
      const res = await fetch(`${API_URL}/supplier`, { headers });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((s) => ({
        value: s.id,
        label: s.nome,
      }));
    }
    case 'items': {
      const res = await fetch(`${API_URL}/items`, { headers });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((i) => ({
        value: i.id_item,
        label: `${i.codigo_interno ? i.codigo_interno + ' — ' : ''}${i.nome}`,
      }));
    }
    case 'users': {
      const res = await fetch(`${API_URL}/users`, { headers });
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((u) => ({
        value: u.id_usuario,
        label: u.nome,
      }));
    }
    default:
      return [];
  }
}

/* ───── Componente ───── */
export default function ReportFilters({ reportType, filters, onChange, onGenerate, loading }) {
  const [optionsCache, setOptionsCache] = useState({});
  const [loadingSources, setLoadingSources] = useState({});

  const filterDefs = REPORT_FILTERS[reportType] || [];

  // Carregar opções dos selects com source
  const loadSource = useCallback(async (source) => {
    if (optionsCache[source] || loadingSources[source]) return;
    setLoadingSources((prev) => ({ ...prev, [source]: true }));
    try {
      const opts = await fetchOptions(source);
      setOptionsCache((prev) => ({ ...prev, [source]: opts }));
    } catch (err) {
      console.error(`Erro ao carregar ${source}:`, err);
      setOptionsCache((prev) => ({ ...prev, [source]: [] }));
    } finally {
      setLoadingSources((prev) => ({ ...prev, [source]: false }));
    }
  }, [optionsCache, loadingSources]);

  useEffect(() => {
    filterDefs.forEach((f) => {
      if (f.source && !optionsCache[f.source]) {
        loadSource(f.source);
      }
    });
  }, [reportType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onChange({});
  };

  // Conta filtros ativos
  const activeCount = Object.values(filters).filter((v) => v !== '' && v != null).length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Filtros
        </Typography>
        {activeCount > 0 && (
          <Chip label={`${activeCount} ativo${activeCount > 1 ? 's' : ''}`} size="small" color="primary" />
        )}
      </Box>

      <Grid container spacing={2}>
        {filterDefs.map((f) => {
          const value = filters[f.name] ?? '';

          if (f.type === 'date') {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={f.name}>
                <TextField
                  label={f.label}
                  type="date"
                  value={value}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            );
          }

          if (f.type === 'number') {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={f.name}>
                <TextField
                  label={f.label}
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  fullWidth
                  size="small"
                  slotProps={{ input: { inputProps: { min: 0, step: 0.01 } } }}
                />
              </Grid>
            );
          }

          if (f.type === 'select') {
            // Opções fixas (options) ou carregadas dinamicamente (source)
            const opts = f.options || optionsCache[f.source] || [];
            const isLoading = f.source && loadingSources[f.source];

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={f.name}>
                <TextField
                  label={f.label}
                  select
                  value={value}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  fullWidth
                  size="small"
                  disabled={isLoading}
                  slotProps={{
                    input: {
                      endAdornment: isLoading ? <CircularProgress size={18} sx={{ mr: 2 }} /> : null,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {opts.map((opt) => (
                    <MenuItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            );
          }

          return null;
        })}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ClearAllIcon />}
          onClick={handleClear}
          disabled={activeCount === 0}
          size="small"
        >
          Limpar filtros
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </Button>
      </Box>
    </Paper>
  );
}
