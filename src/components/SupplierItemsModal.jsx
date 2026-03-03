import { useState, useEffect } from 'react';
import {
  getItemSuppliers,
  createItemSupplier,
  deleteItemSupplier,
} from '../services/itemSupplierServices';
import { getItems } from '../services/itemServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Collapse,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function SupplierItemsModal({ open, onClose, supplier }) {
  const [relations, setRelations] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    itemId: '',
    preco: '',
    prazo_entrega: '',
  });

  // Carregar itens vinculados ao fornecedor
  const fetchItems = async () => {
    if (!supplier) return;
    try {
      setLoading(true);
      setError('');
      const data = await getItemSuppliers({ supplierId: supplier.id });
      setRelations(data);
    } catch (err) {
      console.error('Erro ao buscar itens do fornecedor:', err);
      setError('Erro ao carregar itens.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar todos os itens (para o select de adição)
  const fetchAllItems = async () => {
    try {
      const data = await getItems();
      setAllItems(data);
    } catch (err) {
      console.error('Erro ao buscar itens:', err);
    }
  };

  useEffect(() => {
    if (open && supplier) {
      fetchItems();
      fetchAllItems();
      setShowAddForm(false);
      setError('');
    }
  }, [open, supplier]);

  // Itens disponíveis = todos - já vinculados
  const availableItems = allItems.filter(
    (i) => !relations.some((r) => r.itemId === i.id_item)
  );

  const handleAddChange = (e) => {
    const { name, value, type } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.itemId) return;

    setAddLoading(true);
    setError('');
    try {
      await createItemSupplier({
        itemId: addForm.itemId,
        supplierId: supplier.id,
        preco: addForm.preco || null,
        prazo_entrega: addForm.prazo_entrega || null,
      });
      setAddForm({ itemId: '', preco: '', prazo_entrega: '' });
      setShowAddForm(false);
      await fetchItems();
    } catch (err) {
      console.error('Erro ao vincular item:', err);
      setError('Erro ao vincular item. Tente novamente.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (relationId) => {
    if (!window.confirm('Remover este item do fornecedor?')) return;
    try {
      await deleteItemSupplier(relationId);
      setRelations((prev) => prev.filter((r) => r.id !== relationId));
    } catch (err) {
      console.error('Erro ao remover vínculo:', err);
      setError('Erro ao remover vínculo.');
    }
  };

  const handleClose = () => {
    setShowAddForm(false);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon color="primary" />
          <Box component="span" sx={{ fontWeight: 600 }}>
            Itens fornecidos por: {supplier?.nome || ''}
          </Box>
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Botão Adicionar Item */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={availableItems.length === 0 && !showAddForm}
            size="small"
          >
            {showAddForm ? 'Cancelar' : 'Adicionar Item'}
          </Button>
          {availableItems.length === 0 && !showAddForm && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Todos os itens já estão vinculados
            </Typography>
          )}
        </Box>

        {/* Formulário de adição (colapsável) */}
        <Collapse in={showAddForm}>
          <Paper
            elevation={1}
            sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon fontSize="small" color="action" />
              Vincular novo item
            </Typography>
            <Box component="form" onSubmit={handleAddSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    name="itemId"
                    label="Item"
                    value={addForm.itemId}
                    onChange={handleAddChange}
                    required
                    size="small"
                  >
                    {availableItems.map((i) => (
                      <MenuItem key={i.id_item} value={i.id_item}>
                        {i.nome} — {i.codigo_interno}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="preco"
                    label="Preço (R$)"
                    value={addForm.preco}
                    onChange={handleAddChange}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name="prazo_entrega"
                    label="Prazo de Entrega"
                    value={addForm.prazo_entrega}
                    onChange={handleAddChange}
                    size="small"
                    placeholder="Ex: 7 dias"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setShowAddForm(false);
                    setAddForm({ itemId: '', preco: '', prazo_entrega: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={addLoading || !addForm.itemId}
                  startIcon={<SaveIcon />}
                >
                  {addLoading ? 'Vinculando...' : 'Vincular'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Tabela de itens vinculados */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }} color="text.secondary">
              Carregando itens...
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Código Interno</TableCell>
                  <TableCell>Unidade</TableCell>
                  <TableCell align="right">Preço (R$)</TableCell>
                  <TableCell>Prazo de Entrega</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relations.length > 0 ? (
                  relations.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InventoryIcon fontSize="small" color="action" />
                          {rel.Item?.nome || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>{rel.Item?.codigo_interno || '-'}</TableCell>
                      <TableCell>{rel.Item?.unidade_medida || '-'}</TableCell>
                      <TableCell align="right">
                        {rel.preco != null
                          ? Number(rel.preco).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>{rel.prazo_entrega || '-'}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Remover vínculo">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(rel.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Nenhum item vinculado a este fornecedor
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
