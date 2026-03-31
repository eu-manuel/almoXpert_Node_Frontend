import { useState, useContext } from 'react';
import SideNav from '../components/SideNav';
import ProcessoTable from '../components/ProcessoTable';
import ProcessoFormModal from '../components/ProcessoFormModal';
import { UserContext } from '../context/UserContext';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function ProcessoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [processoToEdit, setProcessoToEdit] = useState(null);
  const { user } = useContext(UserContext);

  const handleEdit = (processo) => {
    setProcessoToEdit(processo);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setProcessoToEdit(null);
  };

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
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
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Processos de Aquisição
            </Typography>
          </Box>

          <ProcessoTable refreshFlag={refreshFlag} onEdit={handleEdit} />

          {/* FAB para criar novo processo */}
          <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
            <ProcessoFormModal onCreated={handleRefresh} />
          </Box>

          {/* Modal para editar processo */}
          <ProcessoFormModal
            processoToEdit={processoToEdit}
            open={editModalOpen}
            onClose={handleCloseEdit}
            onSaved={handleRefresh}
            showFab={false}
          />
        </Container>
      </Box>
    </Box>
  );
}
