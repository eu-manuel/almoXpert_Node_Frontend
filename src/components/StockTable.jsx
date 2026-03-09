import React, { useState } from 'react';
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
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  updateItemWarehouse,
  deleteItemWarehouse,
} from '../services/itemWarehouseServices';

export default function StockTable({ items, loading, warehouseName, onRefresh }) {
  // --- Estados de Edição ---
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [editForm, setEditForm] = useState({ quantidade: '', observacao: '' });
  const [editLoading, setEditLoading] = useState(false);

  // --- Estados de Exclusão ---
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Snackbar ---
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // ========== EDIÇÃO ==========
  const handleOpenEdit = (itemWarehouse) => {
    setEditForm({
      quantidade: itemWarehouse.quantidade,
      observacao: '',
    });
    setEditDialog({ open: true, item: itemWarehouse });
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, item: null });
    setEditForm({ quantidade: '', observacao: '' });
  };

  const handleSaveEdit = async () => {
    try {
      setEditLoading(true);
      await updateItemWarehouse(editDialog.item.id, {
        quantidade: Number(editForm.quantidade),
        observacao: editForm.observacao || undefined,
      });
      setSnackbar({ open: true, message: 'Quantidade atualizada com sucesso!', severity: 'success' });
      handleCloseEdit();
      onRefresh?.();
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao atualizar: ' + err.message, severity: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const editDiferenca = editDialog.item
    ? Number(editForm.quantidade) - editDialog.item.quantidade
    : 0;

  // ========== EXCLUSÃO ==========
  const handleOpenDelete = (itemWarehouse) => {
    setDeleteDialog({ open: true, item: itemWarehouse });
  };

  const handleCloseDelete = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteItemWarehouse(deleteDialog.item.id);
      setSnackbar({ open: true, message: 'Item removido do almoxarifado com sucesso!', severity: 'success' });
      handleCloseDelete();
      onRefresh?.();
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao remover: ' + err.message, severity: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ========== RENDER ==========
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
        <Typography sx={{ ml: 2 }}>Carregando itens do estoque...</Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography color="text.secondary">
          {warehouseName
            ? `Nenhum item encontrado no almoxarifado "${warehouseName}".`
            : 'Selecione um almoxarifado para visualizar o estoque.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {warehouseName && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WarehouseIcon color="primary" />
          <Typography variant="h6" component="h3">
            Estoque: {warehouseName}
          </Typography>
        </Box>
      )}

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Item</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell>Data de Entrada</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((itemWarehouse) => (
              <TableRow key={itemWarehouse.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon fontSize="small" color="action" />
                    {itemWarehouse.Item?.nome || '-'}
                  </Box>
                </TableCell>
                <TableCell>
                  {itemWarehouse.Item?.codigo_interno || '-'}
                </TableCell>
                <TableCell>
                  {itemWarehouse.Item?.unidade_medida || '-'}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={itemWarehouse.quantidade}
                    color={itemWarehouse.quantidade > 0 ? 'primary' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600, minWidth: 50 }}
                  />
                </TableCell>
                <TableCell>{formatDate(itemWarehouse.data_entrada)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="secondary"
                    title="Editar quantidade"
                    onClick={() => handleOpenEdit(itemWarehouse)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    title="Remover do almoxarifado"
                    onClick={() => handleOpenDelete(itemWarehouse)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total de itens: <strong>{items.length}</strong>
        </Typography>
      </Box>

      {/* ========== Dialog de Edição ========== */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Quantidade
        </DialogTitle>
        <DialogContent>
          {editDialog.item && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'secondary.main',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Item: <strong>{editDialog.item.Item?.nome || '-'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Almoxarifado: <strong>{warehouseName}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantidade atual: <strong>{editDialog.item.quantidade}</strong>
                </Typography>
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Nova Quantidade"
                value={editForm.quantidade}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, quantidade: e.target.value }))
                }
                inputProps={{ min: 0 }}
                autoFocus
              />

              {editForm.quantidade !== '' && editDiferenca !== 0 && (
                <Alert severity={editDiferenca > 0 ? 'info' : 'warning'} variant="outlined">
                  {editDiferenca > 0
                    ? `Serão adicionadas ${editDiferenca} unidades (entrada)`
                    : `Serão removidas ${Math.abs(editDiferenca)} unidades (saída)`}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Observação (opcional)"
                placeholder="Ex: Ajuste de inventário, Correção, etc."
                value={editForm.observacao}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, observacao: e.target.value }))
                }
                multiline
                rows={2}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEdit} disabled={editLoading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              editLoading ||
              editForm.quantidade === '' ||
              Number(editForm.quantidade) < 0 ||
              editDiferenca === 0
            }
          >
            {editLoading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== Dialog de Exclusão ========== */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Remoção
        </DialogTitle>
        <DialogContent>
          {deleteDialog.item && (
            <Box sx={{ pt: 1 }}>
              <Typography gutterBottom>
                Tem certeza que deseja remover{' '}
                <strong>{deleteDialog.item.Item?.nome || 'este item'}</strong>{' '}
                do almoxarifado <strong>{warehouseName}</strong>?
              </Typography>
              {deleteDialog.item.quantidade > 0 && (
                <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                  A quantidade atual de{' '}
                  <strong>{deleteDialog.item.quantidade}</strong> unidades será
                  registrada como saída.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : 'Remover'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== Snackbar de Feedback ========== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
