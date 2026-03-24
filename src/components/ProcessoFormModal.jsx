import { useState, useEffect } from 'react';
import {
  createProcesso,
  updateProcesso,
} from '../services/processoServices';
import { getWarehouses } from '../services/warehouseServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Fab,
  Grid,
  IconButton,
  Alert,
  InputAdornment,
  MenuItem,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';

const emptyForm = {
  numero_processo: '',
  id_almoxarifado: '',
  observacao: '',
};

export default function ProcessoFormModal({
  onCreated,
  onSaved,
  processoToEdit = null,
  open: externalOpen,
  onClose: externalOnClose,
  showFab = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [warehouses, setWarehouses] = useState([]);

  const isEditMode = !!processoToEdit;

  // Carregar almoxarifados para o seletor
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (err) {
        console.error('Erro ao buscar almoxarifados:', err.message);
      }
    };
    fetchWarehouses();
  }, []);

  // Preencher formulário quando entrar em modo edição
  useEffect(() => {
    if (processoToEdit) {
      setForm({
        numero_processo: processoToEdit.numero_processo || '',
        id_almoxarifado: processoToEdit.id_almoxarifado || '',
        observacao: processoToEdit.observacao || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [processoToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalOpen(false);
    }
    setError('');
    if (!isEditMode) {
      setForm(emptyForm);
    }
  };

  const handleOpen = () => {
    setInternalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.numero_processo.trim()) {
      setError('O número do processo é obrigatório.');
      setLoading(false);
      return;
    }

    if (!form.id_almoxarifado) {
      setError('Selecione um almoxarifado.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...form,
        id_almoxarifado: parseInt(form.id_almoxarifado, 10),
      };

      if (isEditMode) {
        await updateProcesso(processoToEdit.id_processo, dataToSend);
        onSaved?.();
      } else {
        // Remover status na criação (usa default)
        delete dataToSend.status;
        await createProcesso(dataToSend);
        onCreated?.();
      }

      setForm(emptyForm);
      handleClose();
    } catch (err) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'criar'} processo:`,
        err
      );
      setError(
        err.message ||
          `Erro ao ${isEditMode ? 'atualizar' : 'criar'} processo. Tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB para abrir modal (apenas modo criação) */}
      {showFab && !isEditMode && (
        <Tooltip title="Criar novo processo">
          <Fab
            color="secondary"
            size="medium"
            onClick={handleOpen}
            sx={{ flexShrink: 0 }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
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
            {isEditMode ? (
              <EditIcon color="primary" />
            ) : (
              <AssignmentIcon color="primary" />
            )}
            {isEditMode ? 'Editar Processo' : 'Novo Processo'}
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2.5}>
              {/* Número do Processo */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="numero_processo"
                  label="N° do Processo"
                  value={form.numero_processo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: PE-2026/001"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Almoxarifado */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  name="id_almoxarifado"
                  label="Almoxarifado Recebedor"
                  value={form.id_almoxarifado}
                  onChange={handleChange}
                  required
                >
                  {warehouses.map((w) => (
                    <MenuItem key={w.id_almoxarifado} value={w.id_almoxarifado}>
                      {w.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


              {/* Observação */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="observacao"
                  label="Observação"
                  value={form.observacao}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Observações sobre o processo (opcional)"
                />
              </Grid>
            </Grid>

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
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                startIcon={<CancelIcon />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                {loading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Salvar'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
