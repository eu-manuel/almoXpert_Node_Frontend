import React, { useEffect, useState, useContext } from "react";
import { getMyWarehouses, deleteWarehouse, getWarehouseStats } from "../services/warehouseServices";
import { UserContext } from "../context/UserContext";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarningIcon from "@mui/icons-material/Warning";

const WarehouseTable = ({ refreshFlag, onEdit }) => {
  const { user } = useContext(UserContext);
  const isAdminUser = user?.isAdmin === true;
  
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog de confirmação
  const [deleteDialog, setDeleteDialog] = useState({ open: false, warehouse: null, stats: null, loading: false });
  
  // Snackbar para mensagens
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

  // Abrir dialog de confirmação com stats
  const handleOpenDeleteDialog = async (warehouse) => {
    setDeleteDialog({ open: true, warehouse, stats: null, loading: true });
    try {
      const stats = await getWarehouseStats(warehouse.id_almoxarifado);
      setDeleteDialog((prev) => ({ ...prev, stats, loading: false }));
    } catch (err) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setSnackbar({ open: true, message: "Erro ao buscar estatísticas", severity: "error" });
    }
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    const { warehouse } = deleteDialog;
    try {
      const result = await deleteWarehouse(warehouse.id_almoxarifado);
      setWarehouses((prev) => prev.filter((w) => w.id_almoxarifado !== warehouse.id_almoxarifado));
      setDeleteDialog({ open: false, warehouse: null, stats: null, loading: false });
      setSnackbar({ 
        open: true, 
        message: `Almoxarifado excluído com sucesso! (${result.deletedLinks?.movements || 0} movimentações e ${result.deletedLinks?.items || 0} itens removidos)`,
        severity: "success"
      });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Erro ao excluir almoxarifado", severity: "error" });
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
                    {isAdminUser && (
                      <Tooltip title="Excluir (Admin)">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(w)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
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
      
      {/* Dialog de confirmação de exclusão (Admin) */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, warehouse: null, stats: null, loading: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          {deleteDialog.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Carregando informações...</Typography>
            </Box>
          ) : (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Você está prestes a excluir o almoxarifado <strong>{deleteDialog.warehouse?.nome}</strong>.
              </DialogContentText>
              
              {deleteDialog.stats?.hasLinkedData && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Este almoxarifado possui dados vinculados que também serão excluídos:
                  </Typography>
                  <Box component="ul" sx={{ mb: 0, mt: 1 }}>
                    <li><strong>{deleteDialog.stats.movementsCount}</strong> movimentação(ões)</li>
                    <li><strong>{deleteDialog.stats.itemsCount}</strong> item(ns) no estoque</li>
                  </Box>
                </Alert>
              )}
              
              <DialogContentText color="error">
                Esta ação é irreversível!
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, warehouse: null, stats: null, loading: false })}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteDialog.loading}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </TableContainer>
  );
};

export default WarehouseTable;
