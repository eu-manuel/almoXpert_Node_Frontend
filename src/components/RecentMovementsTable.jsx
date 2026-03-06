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
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const TIPO_CONFIG = {
  entrada: { label: 'Entrada', color: 'success', icon: <MoveToInboxIcon sx={{ fontSize: 16 }} /> },
  saida: { label: 'Saída', color: 'error', icon: <OutboxIcon sx={{ fontSize: 16 }} /> },
  ajuste: { label: 'Ajuste', color: 'warning', icon: <SyncAltIcon sx={{ fontSize: 16 }} /> },
};

/**
 * Tabela das últimas movimentações.
 *
 * Props:
 *  - data: [{
 *      id: 1,
 *      tipo: 'entrada',
 *      quantidade: 100,
 *      data: '2026-03-01',
 *      item: 'Parafuso',
 *      almoxarifado: 'Central',
 *      usuario: 'João'
 *    }, ...]
 *    (array retornado por /api/dashboard/stats → ultimasMovimentacoes)
 */
export default function RecentMovementsTable({ data = [] }) {
  if (!data.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nenhuma movimentação registrada
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
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
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Item</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Almoxarifado</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }} align="right">Qtd</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Data</TableCell>
            <TableCell sx={{ fontWeight: 700, backgroundColor: '#1e1e2f' }}>Usuário</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            const tipoKey = (row.tipo || '').toLowerCase();
            const cfg = TIPO_CONFIG[tipoKey] || { label: row.tipo, color: 'default', icon: null };

            return (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Chip
                    icon={cfg.icon}
                    label={cfg.label}
                    color={cfg.color}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{row.item || '—'}</TableCell>
                <TableCell>{row.almoxarifado || '—'}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {row.quantidade}
                </TableCell>
                <TableCell>{formatDate(row.data)}</TableCell>
                <TableCell>{row.usuario || '—'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
