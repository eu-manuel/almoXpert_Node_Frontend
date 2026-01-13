import React, { useEffect, useState } from "react";
import { getMyWarehouses, deleteWarehouse } from "../services/warehouseServices";
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
  CircularProgress,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const WarehouseTable = ({ refreshFlag, onEdit }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await getMyWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error("Erro ao buscar almoxarifados:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este almoxarifado?")) return;
    try {
      await deleteWarehouse(id);
      setWarehouses((prev) => prev.filter((w) => w.id_almoxarifado !== id));
    } catch (err) {
      console.error("Erro ao excluir almoxarifado:", err.message);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [refreshFlag]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando almoxarifados...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Localização</TableCell>
            <TableCell align="center">Capacidade</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warehouses.length > 0 ? (
            warehouses.map((w) => (
              <TableRow key={w.id_almoxarifado}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarehouseIcon fontSize="small" color="primary" />
                    <Typography fontWeight={500}>{w.nome}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {w.descricao || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {w.localizacao ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                      {w.localizacao}
                    </Box>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {w.capacidade_maxima ? w.capacidade_maxima.toLocaleString('pt-BR') : "-"}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={w.status === "ativo" ? "Ativo" : "Inativo"}
                    color={w.status === "ativo" ? "success" : "default"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit?.(w)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(w.id_almoxarifado)}
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
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <WarehouseIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  Nenhum almoxarifado encontrado
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WarehouseTable;
