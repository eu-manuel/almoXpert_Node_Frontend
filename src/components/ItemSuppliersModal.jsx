import { useState, useEffect } from 'react';
import {
  getItemSuppliers,
  createItemSupplier,
  deleteItemSupplier,
} from '../services/itemSupplierServices';
import { getSuppliers } from '../services/supplierServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Collapse,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BusinessIcon from '@mui/icons-material/Business';

export default function ItemSuppliersModal({ open, onClose, item }) {
  const [relations, setRelations] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    supplierId: '',
    preco: '',
    prazo_entrega: '',
  });

  // Carregar fornecedores vinculados ao item
  const fetchRelations = async () => {
    if (!item) return;
    try {
      setLoading(true);
      const data = await getItemSuppliers({ itemId: item.id_item });
      setRelations(data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores do item:', err);
      setError('Erro ao carregar fornecedores.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar todos os fornecedores (para o select de adição)
  const fetchAllSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setAllSuppliers(data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  useEffect(() => {
    if (open && item) {
      fetchRelations();
      fetchAllSuppliers();
      setShowAddForm(false);
      setError('');
    }
  }, [open, item]);

  // Fornecedores disponíveis = todos - já vinculados
  const availableSuppliers = allSuppliers.filter(
    (s) => !relations.some((r) => r.supplierId === s.id)
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
    if (!addForm.supplierId) return;

    setAddLoading(true);
    setError('');
    try {
      await createItemSupplier({
        itemId: item.id_item,
        supplierId: addForm.supplierId,
        preco: addForm.preco || null,
        prazo_entrega: addForm.prazo_entrega || null,
      });
      setAddForm({ supplierId: '', preco: '', prazo_entrega: '' });
      setShowAddForm(false);
      await fetchRelations();
    } catch (err) {
      console.error('Erro ao vincular fornecedor:', err);
      setError('Erro ao vincular fornecedor. Tente novamente.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (relationId) => {
    if (!window.confirm('Remover este fornecedor do item?')) return;
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
          <LocalShippingIcon color="primary" />
          <Box component="span" sx={{ fontWeight: 600 }}>
            Fornecedores de: {item?.nome || ''}
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

        {/* Botão Adicionar Fornecedor */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={availableSuppliers.length === 0 && !showAddForm}
            size="small"
          >
            {showAddForm ? 'Cancelar' : 'Adicionar Fornecedor'}
          </Button>
          {availableSuppliers.length === 0 && !showAddForm && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Todos os fornecedores já estão vinculados
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
              <BusinessIcon fontSize="small" color="action" />
              Vincular novo fornecedor
            </Typography>
            <Box component="form" onSubmit={handleAddSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    name="supplierId"
                    label="Fornecedor"
                    value={addForm.supplierId}
                    onChange={handleAddChange}
                    required
                    size="small"
                  >
                    {availableSuppliers.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.nome} — {s.CNPJ}
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
                    setAddForm({ supplierId: '', preco: '', prazo_entrega: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={addLoading || !addForm.supplierId}
                  startIcon={<SaveIcon />}
                >
                  {addLoading ? 'Vinculando...' : 'Vincular'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Tabela de fornecedores vinculados */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }} color="text.secondary">
              Carregando fornecedores...
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
                  <TableCell>Fornecedor</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Preço (R$)</TableCell>
                  <TableCell>Prazo</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relations.length > 0 ? (
                  relations.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon fontSize="small" color="action" />
                          {rel.Supplier?.nome || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>{rel.Supplier?.CNPJ || '-'}</TableCell>
                      <TableCell>{rel.Supplier?.email || '-'}</TableCell>
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
                        Nenhum fornecedor vinculado a este item
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
