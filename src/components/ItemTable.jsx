import React, { useEffect, useState } from 'react';
import { getItems, deleteItem } from '../services/itemServices';
import Modal from './GenericModal';
import ItemForm from './ItemForm';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Fab,
  Tooltip,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function ItemTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id_item !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'default';
      case 'descontinuado':
        return 'error';
      default:
        return 'default';
    }
  };

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
        <Typography sx={{ ml: 2 }}>Carregando itens...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Fab
        color="primary"
        onClick={() => {
          setItemToEdit(null);
          setModalOpen(true);
        }}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Código Interno</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell align="center">Est. Mínimo</TableCell>
              <TableCell align="center">Est. Máximo</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id_item}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon fontSize="small" color="action" />
                      {item.nome}
                    </Box>
                  </TableCell>
                  <TableCell>{item.descricao || '-'}</TableCell>
                  <TableCell>{item.codigo_interno || '-'}</TableCell>
                  <TableCell>{item.unidade_medida || '-'}</TableCell>
                  <TableCell align="center">
                    {item.estoque_minimo ?? '-'}
                  </TableCell>
                  <TableCell align="center">
                    {item.estoque_maximo ?? '-'}
                  </TableCell>
                  <TableCell align="center">
                    {item.status && (
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    )}
                  </TableCell>
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
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.id_item)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum item encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        title={itemToEdit ? 'Editar Item' : 'Novo Item'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ItemForm
          itemToEdit={itemToEdit}
          onClose={() => setModalOpen(false)}
          onSaved={fetchItems}
        />
      </Modal>
    </Box>
  );
}
