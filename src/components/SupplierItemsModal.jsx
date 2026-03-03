import { useState, useEffect } from 'react';
import { getItemSuppliers } from '../services/itemSupplierServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function SupplierItemsModal({ open, onClose, supplier }) {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (open && supplier) {
      fetchItems();
    }
  }, [open, supplier]);

  const handleClose = () => {
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
