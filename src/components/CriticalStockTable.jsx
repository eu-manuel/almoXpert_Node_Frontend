import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Tabela de itens com estoque crítico (abaixo do mínimo).
 *
 * Props:
 *  - data: [{
 *      nome: 'Parafuso M6',
 *      codigo_interno: 'PAR006',
 *      quantidade_atual: 5,
 *      estoque_minimo: 20,
 *      almoxarifado: 'Central'
 *    }, ...]
 *    (array retornado por /api/dashboard/stats → itensEstoqueCritico)
 */
export default function CriticalStockTable({ data = [] }) {
  if (!data.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#16a34a', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          Nenhum item em estado crítico 🎉
        </Typography>
      </Box>
    );
  }

  const getStatus = (qtdAtual, estoqueMin) => {
    const ratio = qtdAtual / estoqueMin;
    if (ratio <= 0.25) return { label: 'Crítico', color: 'error' };
    if (ratio <= 0.5) return { label: 'Baixo', color: 'warning' };
    return { label: 'Atenção', color: 'warning' };
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        maxHeight: 320,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Item</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Código</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Almoxarifado</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }} align="right">Qtd Atual</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }} align="right">Est. Mínimo</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }} align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => {
            const status = getStatus(row.quantidade_atual, row.estoque_minimo);
            return (
              <TableRow key={idx} hover>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.codigo_interno || '—'}</TableCell>
                <TableCell>{row.almoxarifado || '—'}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {row.quantidade_atual}
                </TableCell>
                <TableCell align="right">{row.estoque_minimo}</TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<WarningAmberIcon />}
                    label={status.label}
                    color={status.color}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
