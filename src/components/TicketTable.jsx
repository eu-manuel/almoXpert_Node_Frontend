import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Typography, Chip, CircularProgress, IconButton, TextField, MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TicketStatusChip from './TicketStatusChip';

export default function TicketTable({ tickets, loading, onViewDetail }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const filtered = tickets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (tipoFilter && t.tipo !== tipoFilter) return false;
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando tickets...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="aberto">Aberto</MenuItem>
          <MenuItem value="enviado_validacao">Enviado p/ Validação</MenuItem>
          <MenuItem value="aprovado">Aprovado</MenuItem>
          <MenuItem value="recusado">Recusado</MenuItem>
          <MenuItem value="aguardando_conclusao">Aguardando Conclusão</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="planejado">Planejado</MenuItem>
          <MenuItem value="emergencia">Emergência</MenuItem>
        </TextField>
      </Box>

      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ConfirmationNumberIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">
            Nenhum ticket encontrado.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>CR</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Itens</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((ticket) => (
                <TableRow key={ticket.id_ticket} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {ticket.titulo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.CentroResponsabilidade?.codigo || '-'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.tipo === 'emergencia' ? '⚠ Emergência' : 'Planejado'}
                      size="small"
                      color={ticket.tipo === 'emergencia' ? 'error' : 'default'}
                      variant={ticket.tipo === 'emergencia' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <TicketStatusChip status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    {ticket.TicketItems?.length || 0}
                  </TableCell>
                  <TableCell>{formatDate(ticket.data_criacao)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      title="Ver detalhes"
                      onClick={() => onViewDetail(ticket)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box
        sx={{
          display: 'flex', justifyContent: 'flex-end',
          mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total: <strong>{filtered.length}</strong> ticket(s)
        </Typography>
      </Box>
    </Box>
  );
}
