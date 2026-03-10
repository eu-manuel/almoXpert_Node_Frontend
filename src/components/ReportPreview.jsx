/**
 * ReportPreview — Tabela de pré-visualização dos dados do relatório + botões de exportação.
 *
 * Props:
 *  - data: { titulo, dados, colunas, resumo, usuario, geradoEm, filtros }
 *  - reportType: string
 *  - filters: Object
 *  - onExport: (formato: 'pdf'|'excel') => void
 *  - exporting: boolean
 */

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';

/* Formata valores para exibição na tabela */
function formatCell(value, colKey) {
  if (value == null || value === '') return '—';

  // Campos de valor monetário
  if (
    colKey.includes('valor') ||
    colKey.includes('preco') ||
    colKey === 'valor_unitario' ||
    colKey === 'valor_total' ||
    colKey === 'valor_consumido' ||
    colKey === 'valor_parado'
  ) {
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Campos de percentual
  if (colKey.includes('percent') || colKey.includes('pct') || colKey === 'perc_acumulado' || colKey === 'perc_individual') {
    const num = Number(value);
    if (isNaN(num)) return value;
    return `${num.toFixed(1)}%`;
  }

  // Campos de data
  if (colKey.includes('data') || colKey === 'ultima_movimentacao') {
    if (typeof value === 'string' && value.includes('T')) {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    return value;
  }

  // Urgência com cor
  if (colKey === 'urgencia') {
    const colors = { critico: 'error', alto: 'warning', medio: 'info', baixo: 'success' };
    const labels = { critico: '🔴 Crítico', alto: '🟠 Alto', medio: '🟡 Médio', baixo: '🟢 Baixo' };
    return (
      <Chip
        label={labels[value] || value}
        color={colors[value] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  }

  // Classe ABC com cor
  if (colKey === 'classe') {
    const colors = { A: 'success', B: 'warning', C: 'error' };
    return <Chip label={value} color={colors[value] || 'default'} size="small" />;
  }

  // Tipo de movimentação
  if (colKey === 'tipo') {
    const colors = { entrada: 'success', saida: 'error', transferencia: 'info', ajuste: 'warning' };
    const labels = { entrada: 'Entrada', saida: 'Saída', transferencia: 'Transferência', ajuste: 'Ajuste' };
    return <Chip label={labels[value] || value} color={colors[value] || 'default'} size="small" variant="outlined" />;
  }

  return String(value);
}

export default function ReportPreview({ data, reportType, filters, onExport, exporting }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  if (!data) return null;

  const { titulo, dados, colunas, resumo, usuario, geradoEm } = data;

  if (!dados || dados.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        Nenhum dado encontrado para os filtros aplicados. Tente ajustar os critérios.
      </Alert>
    );
  }

  const paginatedRows = dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mt: 3 }}>
      {/* ── Cabeçalho ── */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dados.length} registro{dados.length !== 1 ? 's' : ''} encontrado{dados.length !== 1 ? 's' : ''}
            {usuario && ` · Gerado por ${usuario}`}
            {geradoEm && ` em ${new Date(geradoEm).toLocaleString('pt-BR')}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => onExport('pdf')}
            disabled={exporting}
            size="small"
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<TableChartIcon />}
            onClick={() => onExport('excel')}
            disabled={exporting}
            size="small"
          >
            Excel
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* ── Tabela de dados ── */}
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {colunas.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'primary.dark',
                    color: 'primary.contrastText',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label || col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{
                  bgcolor: idx % 2 === 0 ? 'background.paper' : 'rgba(255,255,255,0.02)',
                  '&:hover': { bgcolor: 'rgba(22,163,74,0.06)' },
                }}
              >
                {colunas.map((col) => (
                  <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                    {formatCell(row[col.key], col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={dados.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* ── Resumo ── */}
      {resumo && Object.keys(resumo).length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoOutlinedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight={600}>
                Resumo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(resumo).map(([key, value]) => {
                // Formata label: total_itens → Total Itens
                const label = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                // Formata valor
                let displayValue = value;
                if (typeof value === 'number') {
                  if (key.includes('valor') || key.includes('total_valor')) {
                    displayValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                  } else {
                    displayValue = value.toLocaleString('pt-BR');
                  }
                }

                return (
                  <Chip
                    key={key}
                    label={`${label}: ${displayValue}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                );
              })}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
}
