import { useState, useEffect } from 'react';
import { getItems } from '../services/itemServices';
import {
  addItemToProcesso,
  updateProcessoItem,
} from '../services/processoServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  InputAdornment,
  MenuItem,
  Tooltip,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditIcon from '@mui/icons-material/Edit';

const emptyForm = {
  id_item: '',
  quantidade: '',
  preco_unitario: '',
  status: 'pendente',
  motivo_nao_entrega: '',
};

export default function ProcessoItemFormModal({
  idProcesso,
  onCreated,
  onSaved,
  itemToEdit = null,
  open: externalOpen,
  onClose: externalOnClose,
  showFab = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([]);

  const isEditMode = !!itemToEdit;

  // Carregar lista de itens disponíveis
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error('Erro ao buscar itens:', err.message);
      }
    };
    fetchItems();
  }, []);

  // Preencher formulário em modo edição
  useEffect(() => {
    if (itemToEdit) {
      setForm({
        id_item: itemToEdit.id_item || '',
        quantidade: itemToEdit.quantidade || '',
        preco_unitario: itemToEdit.preco_unitario || '',
        status: itemToEdit.status || 'pendente',
        motivo_nao_entrega: itemToEdit.motivo_nao_entrega || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [itemToEdit]);

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

    try {
      const dataToSend = {
        ...form,
        id_item: parseInt(form.id_item, 10),
        quantidade: parseInt(form.quantidade, 10),
        preco_unitario: parseFloat(form.preco_unitario),
      };

      if (isEditMode) {
        await updateProcessoItem(itemToEdit.id_processo_item, dataToSend);
        onSaved?.();
      } else {
        dataToSend.id_processo = idProcesso;
        await addItemToProcesso(dataToSend);
        onCreated?.();
      }

      setForm(emptyForm);
      handleClose();
    } catch (err) {
      console.error(
        `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} item:`,
        err
      );
      setError(
        err.message ||
          `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} item. Tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showFab && !isEditMode && (
        <Tooltip title="Adicionar item ao processo">
          <Fab
            color="primary"
            size="small"
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
              <ShoppingCartIcon color="primary" />
            )}
            {isEditMode ? 'Editar Item do Processo' : 'Adicionar Item'}
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
              {/* Seletor de Item (apenas na criação) */}
              {!isEditMode && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    name="id_item"
                    label="Item"
                    value={form.id_item}
                    onChange={handleChange}
                    required
                  >
                    {items.map((item) => (
                      <MenuItem key={item.id_item} value={item.id_item}>
                        {item.codigo_interno} — {item.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {/* Quantidade */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="quantidade"
                  label="Quantidade"
                  type="number"
                  value={form.quantidade}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              {/* Preço Unitário */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="preco_unitario"
                  label="Preço Unitário (R$)"
                  type="number"
                  value={form.preco_unitario}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0.01, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Status (apenas em edição) */}
              {isEditMode && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    name="status"
                    label="Status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="entregue">Entregue</MenuItem>
                    <MenuItem value="nao_entregue">Não Entregue</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Motivo da não entrega */}
              {form.status === 'nao_entregue' && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="motivo_nao_entrega"
                    label="Motivo da Não Entrega"
                    value={form.motivo_nao_entrega}
                    onChange={handleChange}
                    required
                    multiline
                    rows={2}
                    placeholder="Descreva o motivo pelo qual o item não foi entregue"
                  />
                </Grid>
              )}
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
                {loading
                  ? 'Salvando...'
                  : isEditMode
                    ? 'Atualizar'
                    : 'Adicionar'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
