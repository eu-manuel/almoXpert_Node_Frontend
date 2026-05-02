import React, { useState, useContext } from 'react';
import {
  Box, Typography, Chip, Divider, TextField, Button,
  Alert, CircularProgress, Paper, List, ListItem, ListItemText, Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import BlockIcon from '@mui/icons-material/Block';
import Modal from './GenericModal';
import TicketStatusChip from './TicketStatusChip';
import { UserContext } from '../context/UserContext';
import {
  aprovarTicket,
  recusarTicket,
  cancelarTicket,
  aguardarConclusao,
  addMensagem,
} from '../services/ticketServices';

export default function AtendimentoDetailModal({ ticket, isOpen, onClose, onRefresh }) {
  const { user } = useContext(UserContext);
  const [actionMsg, setActionMsg] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ticket) return null;

  const canAprovar = ['enviado_validacao', 'aguardando_conclusao'].includes(ticket.status);
  const canRecusar = ticket.status === 'enviado_validacao';
  const canAguardar = ticket.status === 'enviado_validacao' && ticket.tipo === 'emergencia';
  const canCancel = !['cancelado', 'aprovado'].includes(ticket.status);
  const canMessage = !['cancelado', 'aprovado'].includes(ticket.status);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleAction = async (actionFn, msg) => {
    if (!msg.trim()) return setError('A mensagem é obrigatória para esta ação.');
    setError('');
    setLoading(true);
    try {
      await actionFn(ticket.id_ticket, msg.trim());
      setActionMsg('');
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!mensagem.trim()) return;
    setLoading(true);
    try {
      await addMensagem(ticket.id_ticket, mensagem.trim());
      setMensagem('');
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Atendimento — Ticket #${ticket.id_ticket}`} isOpen={isOpen} onClose={onClose} maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>{ticket.titulo}</Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitante: <strong>{ticket.Solicitante?.nome || '-'}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CR: <strong>{ticket.CentroResponsabilidade?.codigo || '-'}</strong>
              {ticket.CentroResponsabilidade?.descricao && ` — ${ticket.CentroResponsabilidade.descricao}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <TicketStatusChip status={ticket.status} />
            <Chip
              label={ticket.tipo === 'emergencia' ? '⚠ Emergência' : 'Planejado'}
              size="small"
              color={ticket.tipo === 'emergencia' ? 'error' : 'default'}
              variant={ticket.tipo === 'emergencia' ? 'filled' : 'outlined'}
            />
          </Box>
        </Box>

        {/* Justificativa de emergência */}
        {ticket.justificativa_emergencia && (
          <Alert severity="warning" variant="outlined">
            <strong>Justificativa de Emergência:</strong> {ticket.justificativa_emergencia}
          </Alert>
        )}

        <Divider />

        {/* Itens */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Itens Solicitados ({ticket.TicketItems?.length || 0})
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 1 }}>
            <List dense disablePadding>
              {ticket.TicketItems?.map((item, idx) => (
                <ListItem key={idx} divider={idx < ticket.TicketItems.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.nome_item}
                        {!item.id_item && (
                          <Chip label="Sem cadastro" size="small" color="warning" />
                        )}
                      </Box>
                    }
                    secondary={item.Item?.codigo_interno ? `Código: ${item.Item.codigo_interno}` : null}
                  />
                  <Chip label={`Qtd: ${item.quantidade}`} size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Divider />

        {/* Histórico de mensagens */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Histórico ({ticket.TicketMensagems?.length || 0})
          </Typography>
          <Box sx={{ maxHeight: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {ticket.TicketMensagems?.map((msg) => (
              <Paper
                key={msg.id_mensagem}
                elevation={0}
                sx={{
                  p: 1.5, borderRadius: 1,
                  backgroundColor: msg.id_usuario === user?.id
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(255,255,255,0.05)',
                  borderLeft: '3px solid',
                  borderColor: msg.id_usuario === user?.id ? 'primary.main' : 'divider',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>{msg.User?.nome || 'Usuário'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {msg.status_no_momento && (
                      <Chip label={msg.status_no_momento} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(msg.data_mensagem)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{msg.conteudo}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Enviar mensagem */}
        {canMessage && (
          <>
            <Divider />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enviar mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              />
              <Button variant="outlined" onClick={handleSendMessage} disabled={loading || !mensagem.trim()}>
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          </>
        )}

        {/* Ações do atendente */}
        {(canAprovar || canRecusar || canAguardar || canCancel) && (
          <>
            <Divider />
            <Typography variant="subtitle2">Ações do Atendente</Typography>
            <TextField
              fullWidth
              size="small"
              label="Mensagem da ação (obrigatória)"
              value={actionMsg}
              onChange={(e) => setActionMsg(e.target.value)}
              multiline
              rows={2}
              placeholder="Justifique sua decisão..."
            />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {canAprovar && (
                <Tooltip title="Aprova o pedido e autoriza a entrega dos itens solicitados ao solicitante." arrow>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(aprovarTicket, actionMsg)}
                    disabled={loading}
                    startIcon={<CheckCircleIcon />}
                  >
                    Aprovar
                  </Button>
                </Tooltip>
              )}
              {canRecusar && (
                <Tooltip title="Recusa o pedido e devolve ao solicitante para revisão ou correção." arrow>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction(recusarTicket, actionMsg)}
                    disabled={loading}
                    startIcon={<BlockIcon />}
                  >
                    Recusar
                  </Button>
                </Tooltip>
              )}
              {canAguardar && (
                <Tooltip title="Coloca o ticket em espera até que itens de emergência sejam providenciados ou uma pendência seja resolvida." arrow>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleAction(aguardarConclusao, actionMsg)}
                    disabled={loading}
                    startIcon={<HourglassBottomIcon />}
                  >
                    Aguardar Conclusão
                  </Button>
                </Tooltip>
              )}
              {canCancel && (
                <Tooltip title="Cancela definitivamente o ticket. Esta ação não pode ser desfeita." arrow>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleAction(cancelarTicket, actionMsg)}
                    disabled={loading}
                    startIcon={<CancelIcon />}
                  >
                    Cancelar
                  </Button>
                </Tooltip>
              )}
            </Box>
          </>
        )}

        {error && <Alert severity="error">{error}</Alert>}
        {loading && <CircularProgress size={20} sx={{ alignSelf: 'center' }} />}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
          Criado em: {formatDateTime(ticket.data_criacao)} | Atualizado em: {formatDateTime(ticket.data_atualizacao)}
        </Typography>
      </Box>
    </Modal>
  );
}
