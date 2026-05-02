import { useState, useEffect } from 'react';
import {
  getUsers,
  deleteUser,
  deactivateUser,
  reactivateUser,
} from '../services/userManagementServices';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function UserTable({ refreshFlag, onEdit, onManagePermissions, onManageCRs }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog de exclusão permanente
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Desativar / Reativar
  const handleToggleAtivo = async (user) => {
    try {
      if (user.ativo) {
        await deactivateUser(user.id_usuario);
      } else {
        await reactivateUser(user.id_usuario);
      }
      // Atualiza localmente
      setUsers((prev) =>
        prev.map((u) =>
          u.id_usuario === user.id_usuario ? { ...u, ativo: !u.ativo } : u
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Abrir dialog de exclusão
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteError('');
    setDeleteDialogOpen(true);
  };

  // Confirmar exclusão permanente
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');

    try {
      await deleteUser(userToDelete.id_usuario);
      setUsers((prev) =>
        prev.filter((u) => u.id_usuario !== userToDelete.id_usuario)
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshFlag]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando usuários...</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Permissões</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id_usuario}
                  sx={{
                    ...(!user.ativo && {
                      opacity: 0.5,
                    }),
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: user.isAdmin
                            ? 'primary.main'
                            : 'action.selected',
                          fontSize: '0.875rem',
                        }}
                      >
                        {user.nome?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {user.nome}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {user.isAdmin ? (
                      <Chip
                        icon={<AdminPanelSettingsIcon />}
                        label="Admin"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<PersonIcon />}
                        label="Usuário"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {user.ativo ? (
                      <Chip
                        label="Ativo"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Inativo"
                        size="small"
                        variant="outlined"
                        sx={{ color: 'text.secondary', borderColor: 'text.secondary' }}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {user.Permissions && user.Permissions.length > 0 ? (
                        user.Permissions.map((perm) => (
                          <Chip
                            key={perm.id_permissao}
                            label={perm.nome}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 22,
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Nenhuma
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="Gerenciar permissões">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => onManagePermissions?.(user)}
                        >
                          <SecurityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Vincular CRs">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onManageCRs?.(user)}
                        >
                          <AccountBalanceIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit?.(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.ativo ? 'Desativar' : 'Reativar'}>
                        <IconButton
                          size="small"
                          color={user.ativo ? 'warning' : 'success'}
                          onClick={() => handleToggleAtivo(user)}
                        >
                          {user.ativo ? (
                            <BlockIcon fontSize="small" />
                          ) : (
                            <CheckCircleOutlineIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir permanentemente">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user)}
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum usuário encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmação de exclusão permanente */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Excluir Usuário Permanentemente
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Esta ação é <strong>permanente e irreversível</strong>. Todo o
            histórico do usuário{' '}
            <strong>"{userToDelete?.nome}"</strong> será apagado do sistema,
            incluindo suas permissões. Movimentações e processos associados
            terão o campo de usuário removido.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
          </Typography>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteLoading}
            onClick={handleConfirmDelete}
          >
            {deleteLoading ? 'Excluindo...' : 'Sim, Excluir Permanentemente'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
