import React, { useState, useEffect, useContext, useCallback } from 'react';
import SideNav from '../components/SideNav';
import TicketTable from '../components/TicketTable';
import TicketFormModal from '../components/TicketFormModal';
import TicketDetailModal from '../components/TicketDetailModal';
import { UserContext } from '../context/UserContext';
import { getMeusTickets, getTicketById } from '../services/ticketServices';
import {
  Box, Container, Typography, CircularProgress, Fab,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddIcon from '@mui/icons-material/Add';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function TicketsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState(null);
  const { user } = useContext(UserContext);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeusTickets();
      setTickets(data);
    } catch (err) {
      console.error('Erro ao buscar tickets:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleViewDetail = async (ticket) => {
    try {
      // Buscar ticket atualizado com tudo incluído
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
        console.error('Erro ao atualizar detalhes:', err.message);
      }
    }
    fetchTickets();
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
            <ConfirmationNumberIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Meus Tickets de Pedido
            </Typography>
          </Box>

          <TicketTable
            tickets={tickets}
            loading={loading}
            onViewDetail={handleViewDetail}
          />

          {/* FAB para criar novo ticket */}
          <Fab
            color="primary"
            aria-label="criar ticket"
            onClick={() => setFormOpen(true)}
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
          >
            <AddIcon />
          </Fab>

          {/* Modal de criação */}
          <TicketFormModal
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            onCreated={() => {
              setFormOpen(false);
              fetchTickets();
            }}
          />

          {/* Modal de detalhes */}
          <TicketDetailModal
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
