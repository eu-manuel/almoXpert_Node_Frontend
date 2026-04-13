import { useState, useEffect } from 'react';
import {
  getUsers,
  deleteUser,
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function UserTable({ refreshFlag, onEdit, onManagePermissions }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o usuário "${user.nome}"?`
      )
    )
      return;
    try {
      await deleteUser(user.id_usuario);
      setUsers((prev) =>
        prev.filter((u) => u.id_usuario !== user.id_usuario)
      );
    } catch (err) {
      alert(err.message);
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
            <TableCell>Permissões</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id_usuario}>
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
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit?.(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  Nenhum usuário encontrado
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
