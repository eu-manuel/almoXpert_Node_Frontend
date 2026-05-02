import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  getCRs,
  vincularUsuario,
  desvincularUsuario,
} from '../services/crServices';

export default function UserCRModal({ open, onClose, user, onChanged }) {
  const [crs, setCrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchCRs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCRs();
      setCrs(data);
    } catch (err) {
      console.error('Erro ao buscar CRs:', err);
      setError('Não foi possível carregar a lista de Centros de Responsabilidade.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchCRs();
    } else {
      setCrs([]);
      setError('');
    }
  }, [open, user]);

  const handleToggleCR = async (cr, isAssigned) => {
    if (!user) return;
    setProcessingId(cr.id_cr);
    setError('');

    try {
      if (isAssigned) {
        // Se já está associado, desvincula
        await desvincularUsuario(cr.id_cr, user.id_usuario);
      } else {
        // Se não está associado, vincula
        await vincularUsuario(cr.id_cr, user.id_usuario);
      }
      
      // Atualiza a lista de CRs localmente
      await fetchCRs();
      
      // Notifica o componente pai para atualizar a tabela
      if (onChanged) {
        onChanged();
      }
    } catch (err) {
      setError(err.message || 'Erro ao alterar vinculação de CR.');
    } finally {
      setProcessingId(null);
    }
  };

  // Verifica se o usuário atual possui o CR (iterando pelo array Users retornado pela API)
  const isUserAssignedToCR = (cr) => {
    if (!cr.Users || !Array.isArray(cr.Users)) return false;
    return cr.Users.some((u) => u.id_usuario === user?.id_usuario);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalanceIcon color="primary" />
        Gerenciar Centros de Responsabilidade (CRs)
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Usuário: {user.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : crs.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            {crs.map((cr, index) => {
              const isAssigned = isUserAssignedToCR(cr);
              const isProcessing = processingId === cr.id_cr;

              return (
                <ListItem
                  key={cr.id_cr}
                  divider={index < crs.length - 1}
                  secondaryAction={
                    isProcessing ? (
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                    ) : (
                      <Switch
                        edge="end"
                        onChange={() => handleToggleCR(cr, isAssigned)}
                        checked={isAssigned}
                        disabled={processingId !== null}
                        color="primary"
                      />
                    )
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={isAssigned ? 600 : 400}>
                        {cr.codigo}
                      </Typography>
                    }
                    secondary={cr.descricao || 'Sem descrição'}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Alert severity="info">Nenhum Centro de Responsabilidade encontrado no sistema.</Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
