import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import WarehouseTable from "../components/WarehouseTable";
import WarehouseFormModal from "../components/WarehouseFormModal";
import { UserContext } from "../context/UserContext";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function WarehousePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState(null);
  const { user } = useContext(UserContext);

  // Callback para abrir modal de edição
  const handleEdit = (warehouse) => {
    setWarehouseToEdit(warehouse);
    setEditModalOpen(true);
  };

  // Callback para fechar modal de edição
  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setWarehouseToEdit(null);
  };

  // Callback para atualizar tabela
  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: `${COLLAPSED_WIDTH}px` },
          transition: 'margin 0.3s',
          ...(menuOpen && { ml: { md: `${DRAWER_WIDTH}px` } }),
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <WarehouseIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Almoxarifados
            </Typography>
          </Box>

          <WarehouseTable 
            refreshFlag={refreshFlag} 
            onEdit={handleEdit} 
          />

          {/* FAB para criar novo almoxarifado */}
          <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
            <WarehouseFormModal onCreated={handleRefresh} />
          </Box>

          {/* Modal para editar almoxarifado */}
          <WarehouseFormModal
            warehouseToEdit={warehouseToEdit}
            open={editModalOpen}
            onClose={handleCloseEdit}
            onSaved={handleRefresh}
            showFab={false}
          />
        </Container>
      </Box>
    </Box>
  );
}
