import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton, Badge, Popover, Box, Typography, List, ListItem,
  ListItemText, ListItemButton, Divider, Button, Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import {
  getNotificacoes,
  contarNaoLidas,
  marcarComoLida,
  marcarTodasComoLidas,
} from '../services/notificacaoServices';

const POLL_INTERVAL = 30000; // 30 segundos

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const data = await contarNaoLidas();
      setCount(data.count || 0);
    } catch (err) {
      // silencioso — não bloqueia a UI
    }
  }, []);

  const fetchNotificacoes = useCallback(async () => {
    try {
      const data = await getNotificacoes();
      setNotificacoes(data);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err.message);
    }
  }, []);

  // Polling para badge count
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotificacoes();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (id) => {
    try {
      await marcarComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id_notificacao === id ? { ...n, lida: true } : n))
      );
      setCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await marcarTodasComoLidas();
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
      setCount(0);
    } catch (err) {
      console.error('Erro:', err.message);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <Badge
          badgeContent={count}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              minWidth: 16,
              height: 16,
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 440,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Notificações
          </Typography>
          {count > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllRead}
              sx={{ fontSize: '0.75rem' }}
            >
              Marcar todas
            </Button>
          )}
        </Box>

        <Divider />

        {/* Lista */}
        {notificacoes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma notificação.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 340, overflowY: 'auto' }}>
            {notificacoes.map((n) => (
              <ListItem key={n.id_notificacao} disablePadding>
                <ListItemButton
                  onClick={() => !n.lida && handleMarkRead(n.id_notificacao)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    backgroundColor: n.lida ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                    '&:hover': {
                      backgroundColor: n.lida
                        ? 'action.hover'
                        : 'rgba(99, 102, 241, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                    {!n.lida && (
                      <CircleIcon sx={{ fontSize: 8, color: 'primary.main', mt: 0.8, flexShrink: 0 }} />
                    )}
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: n.lida ? 400 : 600 }}>
                          {n.mensagem}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          {n.Ticket && (
                            <Chip
                              label={`#${n.Ticket.id_ticket}`}
                              size="small"
                              sx={{ fontSize: '0.65rem', height: 18 }}
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(n.data_criacao)}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
