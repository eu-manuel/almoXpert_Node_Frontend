import { useState, useEffect } from 'react';
import { concluirProcesso } from '../services/processoServices';
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
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function ConcluirProcessoModal({
  processo,
  open,
  onClose,
  onConcluded,
}) {
  const [observacao, setObservacao] = useState('');
  const [textoSugerido, setTextoSugerido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const itens = processo?.ProcessoItems || [];
  const itensEntregues = itens.filter((i) => i.status === 'entregue');
  const itensPendentes = itens.filter((i) => i.status !== 'entregue');

  // Gerar texto sugerido quando há itens não entregues
  useEffect(() => {
    if (!processo || !open) return;

    if (itensPendentes.length > 0) {
      const lista = itensPendentes
        .map(
          (pi) =>
            `${pi.Item?.nome || 'Item'} (qtd ${pi.quantidade}, status: ${pi.status === 'nao_entregue' ? 'não entregue' : pi.status})`
        )
        .join(', ');
      const sugerido = `Itens não entregues: ${lista}.`;
      setTextoSugerido(sugerido);
      setObservacao(sugerido + ' ');
    } else {
      setTextoSugerido('');
      setObservacao('');
    }
    setError('');
  }, [processo, open]);

  // Garantir que o texto sugerido não seja removido
  const handleObservacaoChange = (e) => {
    const novoValor = e.target.value;
    if (textoSugerido && !novoValor.startsWith(textoSugerido)) {
      // Restaurar o texto sugerido
      setObservacao(textoSugerido + ' ');
      return;
    }
    setObservacao(novoValor);
  };

  const handleSubmit = async () => {
    if (!observacao.trim()) {
      setError('A observação é obrigatória.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await concluirProcesso(processo.id_processo, {
        observacao: observacao.trim(),
      });
      onConcluded?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao concluir processo.');
    } finally {
      setLoading(false);
    }
  };

  if (!processo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <DoneAllIcon color="success" />
          Concluir Processo
        </Box>
        <IconButton
          onClick={onClose}
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

          {/* Resumo de itens */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Chip
              icon={<CheckCircleIcon />}
              label={`${itensEntregues.length} entregue(s)`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary">
              de {itens.length} item(ns) total
            </Typography>
            {itensPendentes.length > 0 && (
              <Chip
                label={`${itensPendentes.length} pendente(s)/não entregue(s)`}
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          {/* Alerta quando há itens pendentes */}
          {itensPendentes.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Este processo será concluído como{' '}
              <strong>"Concluído com Faltas"</strong>. Apenas os itens entregues
              serão registrados no estoque.
            </Alert>
          )}

          {/* Alerta quando todos entregues */}
          {itensPendentes.length === 0 && itens.length > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Todos os itens foram entregues. O processo será concluído
              normalmente e os itens serão registrados no estoque.
            </Alert>
          )}

          {/* Campo de observação */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observação *"
            value={observacao}
            onChange={handleObservacaoChange}
            placeholder="Observações sobre a conclusão do processo"
            helperText={
              textoSugerido
                ? 'O texto sobre itens pendentes não pode ser removido.'
                : ''
            }
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
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={loading || !observacao.trim()}
              onClick={handleSubmit}
              startIcon={<DoneAllIcon />}
            >
              {loading ? 'Concluindo...' : 'Confirmar Conclusão'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
