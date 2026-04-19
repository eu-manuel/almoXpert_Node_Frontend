import { useState, useEffect } from 'react';
import {
  getPermissions,
  getUserPermissions,
  grantPermission,
  revokePermission,
} from '../services/userManagementServices';
import GenericModal from './GenericModal';
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/**
 * Modal para gerenciar permissões de um usuário.
 *
 * Exibe todas as permissões disponíveis como lista com switches.
 * Ao marcar/desmarcar, faz chamada para grantPermission/revokePermission.
 *
 * Props:
 *   - open: boolean
 *   - onClose: function
 *   - user: object|null — o usuário cujas permissões estão sendo gerenciadas
 *   - onChanged: function — chamado após uma alteração (para refresh da tabela pai)
 */
export default function UserPermissionsModal({ open, onClose, user, onChanged }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [userPermIds, setUserPermIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null); // id da permissão sendo alterada
  const [error, setError] = useState('');

  // Carrega todas as permissões e as do usuário quando o modal abre
  useEffect(() => {
    if (!open || !user) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [perms, userPerms] = await Promise.all([
          getPermissions(),
          getUserPermissions(user.id_usuario),
        ]);

        setAllPermissions(perms);
        setUserPermIds(new Set(userPerms.map((p) => p.id_permissao)));
      } catch (err) {
        console.error('Erro ao carregar permissões:', err);
        setError('Erro ao carregar permissões.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, user]);

  const handleToggle = async (permId) => {
    if (toggling) return; // evita cliques duplos
    setToggling(permId);
    setError('');

    try {
      const hasPermission = userPermIds.has(permId);

      if (hasPermission) {
        await revokePermission(user.id_usuario, permId);
        setUserPermIds((prev) => {
          const next = new Set(prev);
          next.delete(permId);
          return next;
        });
      } else {
        await grantPermission(user.id_usuario, permId);
        setUserPermIds((prev) => new Set(prev).add(permId));
      }

      onChanged?.();
    } catch (err) {
      console.error('Erro ao alterar permissão:', err);
      setError(err.message || 'Erro ao alterar permissão.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <GenericModal
      title="Gerenciar Permissões"
      isOpen={open}
      onClose={onClose}
      maxWidth="sm"
    >
      {/* Cabeçalho com informações do usuário */}
      {user && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <Avatar
            sx={{
              bgcolor: user.isAdmin ? 'primary.main' : 'action.selected',
            }}
          >
            {user.nome?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          {user.isAdmin && (
            <Chip
              icon={<AdminPanelSettingsIcon />}
              label="Admin"
              size="small"
              color="primary"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
      )}

      {user?.isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Administradores têm acesso irrestrito ao sistema, independente das
          permissões atribuídas abaixo.
        </Alert>
      )}

      <Divider sx={{ mb: 1 }} />

      {/* Conteúdo */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ ml: 2 }}>Carregando permissões...</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {allPermissions.map((perm) => (
            <ListItem
              key={perm.id_permissao}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemText
                primary={perm.nome}
                secondary={perm.descricao || '—'}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.8rem',
                }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={userPermIds.has(perm.id_permissao)}
                  onChange={() => handleToggle(perm.id_permissao)}
                  disabled={toggling === perm.id_permissao}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </GenericModal>
  );
}
