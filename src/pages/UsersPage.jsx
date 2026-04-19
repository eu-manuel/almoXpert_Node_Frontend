import { useState, useContext } from 'react';
import SideNav from '../components/SideNav';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import UserPermissionsModal from '../components/UserPermissionsModal';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Fab,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function UsersPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Modal de criação
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Modal de permissões
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [userForPerms, setUserForPerms] = useState(null);

  const { user } = useContext(UserContext);

  // Atualizar tabela
  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
  };

  // Abrir modal de edição
  const handleEdit = (userData) => {
    setUserToEdit(userData);
    setEditModalOpen(true);
  };

  // Fechar modal de edição
  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
  };

  // Abrir modal de permissões
  const handleManagePermissions = (userData) => {
    setUserForPerms(userData);
    setPermModalOpen(true);
  };

  // Fechar modal de permissões
  const handleClosePerms = () => {
    setPermModalOpen(false);
    setUserForPerms(null);
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
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Gestão de Usuários
            </Typography>
          </Box>

          <UserTable
            refreshFlag={refreshFlag}
            onEdit={handleEdit}
            onManagePermissions={handleManagePermissions}
          />

          {/* FAB para criar novo usuário */}
          <Fab
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <AddIcon />
          </Fab>

          {/* Modal de criação */}
          <UserFormModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSaved={handleRefresh}
            userToEdit={null}
          />

          {/* Modal de edição */}
          <UserFormModal
            open={editModalOpen}
            onClose={handleCloseEdit}
            onSaved={handleRefresh}
            userToEdit={userToEdit}
          />

          {/* Modal de permissões */}
          <UserPermissionsModal
            open={permModalOpen}
            onClose={handleClosePerms}
            user={userForPerms}
            onChanged={handleRefresh}
          />
        </Container>
      </Box>
    </Box>
  );
}
