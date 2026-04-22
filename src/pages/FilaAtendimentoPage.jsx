import React, { useState, useEffect, useContext, useCallback } from 'react';
import SideNav from '../components/SideNav';
import TicketTable from '../components/TicketTable';
import AtendimentoDetailModal from '../components/AtendimentoDetailModal';
import { UserContext } from '../context/UserContext';
import { getFilaAtendimento, getTicketById } from '../services/ticketServices';
import {
  Box, Container, Typography, CircularProgress,
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function FilaAtendimentoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailTicket, setDetailTicket] = useState(null);
  const { user } = useContext(UserContext);

  const fetchFila = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFilaAtendimento();
      setTickets(data);
    } catch (err) {
      console.error('Erro ao buscar fila:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFila();
  }, [fetchFila]);

  const handleViewDetail = async (ticket) => {
    try {
      const full = await getTicketById(ticket.id_ticket);
      setDetailTicket(full);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err.message);
    }
  };

  const handleDetailRefresh = async () => {
    if (detailTicket) {
      try {
        const full = await getTicketById(detailTicket.id_ticket);
        setDetailTicket(full);
      } catch (err) {
        // Se o ticket mudou de status e saiu da fila, fechar o modal
        setDetailTicket(null);
      }
    }
    fetchFila();
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: `${COLLAPSED_WIDTH}px` },
          transition: 'margin 0.3s',
          ...(menuOpen && { ml: { md: `${DRAWER_WIDTH}px` } }),
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Fila de Atendimento
            </Typography>
          </Box>

          <TicketTable
            tickets={tickets}
            loading={loading}
            onViewDetail={handleViewDetail}
          />

          {/* Modal de detalhes do atendente */}
          <AtendimentoDetailModal
            ticket={detailTicket}
            isOpen={!!detailTicket}
            onClose={() => setDetailTicket(null)}
            onRefresh={handleDetailRefresh}
          />
        </Container>
      </Box>
    </Box>
  );
}
