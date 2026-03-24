import { useState } from 'react';
import { deleteProcessoItem } from '../services/processoServices';
import ProcessoItemFormModal from './ProcessoItemFormModal';
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
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const itemStatusConfig = {
  pendente: { label: 'Pendente', color: 'warning' },
  entregue: { label: 'Entregue', color: 'success' },
  nao_entregue: { label: 'Não Entregue', color: 'error' },
};

const ProcessoItemTable = ({ processoItems = [], idProcesso, onRefresh, readOnly = false }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEdit = (item) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este item do processo?'))
      return;
    try {
      await deleteProcessoItem(id);
      setSnackbar({
        open: true,
        message: 'Item removido com sucesso!',
        severity: 'success',
      });
      onRefresh?.();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erro ao remover item',
        severity: 'error',
      });
    }
  };

  const handleSaved = () => {
    handleCloseEdit();
    setSnackbar({
      open: true,
      message: 'Item atualizado com sucesso!',
      severity: 'success',
    });
    onRefresh?.();
  };

  const handleCreated = () => {
    setSnackbar({
      open: true,
      message: 'Item adicionado com sucesso!',
      severity: 'success',
    });
    onRefresh?.();
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Box>
      {/* Header com botão de adicionar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Itens do Processo
        </Typography>
        {!readOnly && (
          <ProcessoItemFormModal
            idProcesso={idProcesso}
            onCreated={handleCreated}
            showFab={true}
          />
        )}
      </Box>

      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Código</TableCell>
              <TableCell align="center">Qtd</TableCell>
              <TableCell align="right">Preço Unit.</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Motivo</TableCell>
              {!readOnly && <TableCell align="center">Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {processoItems.length > 0 ? (
              processoItems.map((pi) => {
                const subtotal =
                  parseFloat(pi.preco_unitario) * parseInt(pi.quantidade);
                const statusCfg =
                  itemStatusConfig[pi.status] || itemStatusConfig.pendente;

                return (
                  <TableRow key={pi.id_processo_item}>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {pi.Item?.nome || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {pi.Item?.codigo_interno || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{pi.quantidade}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(pi.preco_unitario)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {formatCurrency(subtotal)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={statusCfg.label}
                        color={statusCfg.color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {pi.motivo_nao_entrega || '-'}
                      </Typography>
                    </TableCell>
                    {!readOnly && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(pi)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(pi.id_processo_item)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <ShoppingCartIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
                  />
                  <Typography color="text.secondary">
                    Nenhum item vinculado a este processo
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de edição */}
      <ProcessoItemFormModal
        idProcesso={idProcesso}
        itemToEdit={itemToEdit}
        open={editModalOpen}
        onClose={handleCloseEdit}
        onSaved={handleSaved}
        showFab={false}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProcessoItemTable;
