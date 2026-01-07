import React from "react";
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
} from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function StockTable({ items, loading, warehouseName }) {
  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
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
            : "Selecione um almoxarifado para visualizar o estoque."
          }
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
      
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Item</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell>Data de Entrada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((itemWarehouse) => (
              <TableRow key={itemWarehouse.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon fontSize="small" color="action" />
                    {itemWarehouse.Item?.nome || "-"}
                  </Box>
                </TableCell>
                <TableCell>{itemWarehouse.Item?.codigo_interno || "-"}</TableCell>
                <TableCell>{itemWarehouse.Item?.unidade_medida || "-"}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={itemWarehouse.quantidade}
                    color={itemWarehouse.quantidade > 0 ? "primary" : "default"}
                    size="small"
                    sx={{ fontWeight: 600, minWidth: 50 }}
                  />
                </TableCell>
                <TableCell>{formatDate(itemWarehouse.data_entrada)}</TableCell>
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
    </Box>
  );
}
