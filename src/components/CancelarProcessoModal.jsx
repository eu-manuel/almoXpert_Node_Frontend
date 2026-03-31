import { useState } from 'react';
import { cancelarProcesso } from '../services/processoServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  IconButton,
  Alert,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BlockIcon from '@mui/icons-material/Block';

export default function CancelarProcessoModal({
  processo,
  open,
  onClose,
  onCancelled,
}) {
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setObservacao('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!observacao.trim()) {
      setError('A justificativa é obrigatória.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await cancelarProcesso(processo.id_processo, {
        observacao: observacao.trim(),
      });
      onCancelled?.();
      handleClose();
    } catch (err) {
      setError(err.message || 'Erro ao cancelar processo.');
    } finally {
      setLoading(false);
    }
  };

  if (!processo) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
          }}
        >
          <BlockIcon color="error" />
          Cancelar Processo
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mt: 2 }}>
          {/* Info do processo */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Processo: <strong>{processo.numero_processo}</strong>
          </Typography>

          {/* Aviso irreversível */}
          <Alert severity="error" sx={{ mb: 3 }}>
            <strong>Esta ação é irreversível.</strong> O processo será cancelado
            e não poderá mais ser editado. Nenhuma movimentação de estoque será
            realizada.
          </Alert>

          {/* Campo de justificativa */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Justificativa *"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Informe o motivo do cancelamento"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 3,
            }}
          >
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              Voltar
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={loading || !observacao.trim()}
              onClick={handleSubmit}
              startIcon={<BlockIcon />}
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
