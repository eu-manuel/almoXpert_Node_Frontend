import React, { useState, useContext } from 'react';
import {
  Box, Typography, Chip, Divider, TextField, Button,
  Alert, CircularProgress, Paper, List, ListItem, ListItemText, Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from './GenericModal';
import TicketStatusChip from './TicketStatusChip';
import { UserContext } from '../context/UserContext';
import {
  enviarParaValidacao,
  cancelarTicket,
  addMensagem,
} from '../services/ticketServices';

export default function TicketDetailModal({ ticket, isOpen, onClose, onRefresh }) {
  const { user } = useContext(UserContext);
  const [mensagem, setMensagem] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ticket) return null;

  const isSolicitante = user && ticket.solicitante_id === user.id;
  const canEdit = isSolicitante && ['aberto', 'recusado'].includes(ticket.status);
  const canSend = isSolicitante && ['aberto', 'recusado'].includes(ticket.status);
  const canCancel = !['cancelado', 'aprovado'].includes(ticket.status);
  const canMessage = !['cancelado', 'aprovado'].includes(ticket.status);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleAction = async (action, msg) => {
    if (!msg.trim()) return setError('A mensagem é obrigatória para esta ação.');
    setError('');
    setLoading(true);
    try {
      await action(ticket.id_ticket, msg.trim());
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
    <Modal title={`Ticket #${ticket.id_ticket}`} isOpen={isOpen} onClose={onClose} maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>{ticket.titulo}</Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitante: {ticket.Solicitante?.nome || '-'}
            </Typography>
            {ticket.Atendente && (
              <Typography variant="body2" color="text.secondary">
                Atendente: {ticket.Atendente.nome}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <TicketStatusChip status={ticket.status} />
            <Chip
              label={ticket.tipo === 'emergencia' ? '⚠ Emergência' : 'Planejado'}
              size="small"
              color={ticket.tipo === 'emergencia' ? 'error' : 'default'}
              variant={ticket.tipo === 'emergencia' ? 'filled' : 'outlined'}
            />
            <Chip
              label={`CR: ${ticket.CentroResponsabilidade?.codigo || '-'}`}
              size="small"
              variant="outlined"
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

        {/* Itens do ticket */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Itens do Pedido ({ticket.TicketItems?.length || 0})
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
            Histórico de Mensagens ({ticket.TicketMensagems?.length || 0})
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {ticket.TicketMensagems?.map((msg) => (
              <Paper
                key={msg.id_mensagem}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: msg.id_usuario === user?.id
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(255,255,255,0.05)',
                  borderLeft: '3px solid',
                  borderColor: msg.id_usuario === user?.id ? 'primary.main' : 'divider',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>
                    {msg.User?.nome || 'Usuário'}
                  </Typography>
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

        {/* Ações do solicitante */}
        {canSend && (
          <>
            <Divider />
            <Typography variant="subtitle2">Ações</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                size="small"
                label="Mensagem para envio"
                value={actionMsg}
                onChange={(e) => setActionMsg(e.target.value)}
                placeholder="Adicione uma mensagem ao enviar..."
              />
              <Tooltip title="Envia o ticket para análise e aprovação do atendente responsável." arrow>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAction(enviarParaValidacao, actionMsg)}
                  disabled={loading}
                  startIcon={<SendIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Enviar p/ Validação
                </Button>
              </Tooltip>
            </Box>
          </>
        )}

        {/* Cancelar */}
        {canCancel && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              size="small"
              label="Motivo do cancelamento"
              value={actionMsg}
              onChange={(e) => setActionMsg(e.target.value)}
              placeholder="Informe o motivo..."
            />
            <Tooltip title="Cancela definitivamente o ticket. Esta ação não pode ser desfeita." arrow>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleAction(cancelarTicket, actionMsg)}
                disabled={loading}
                startIcon={<CancelIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Cancelar Ticket
              </Button>
            </Tooltip>
          </Box>
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
