import { useState, useContext, useEffect } from "react";
import SideNav from "../components/SideNav";
import WarehouseSelector from "../components/WarehouseSelector";
import WarehouseFormModal from "../components/WarehouseFormModal";
import StockTable from "../components/StockTable";
import Modal from "../components/GenericModal";
import AddStockForm from "../components/AddStockForm";
import { UserContext } from "../context/UserContext";
import { getMyWarehouses } from "../services/warehouseServices";
import { getItemsByWarehouse } from "../services/itemWarehouseServices";
import {
  Box,
  Container,
  Typography,
  Fab,
  CircularProgress,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function EstoquePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

  // Estados para almoxarifados
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  // Estados para itens do estoque
  const [stockItems, setStockItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Estado para modal de adicionar item
  const [modalOpen, setModalOpen] = useState(false);

  // Função para buscar almoxarifados do usuário
  const fetchWarehouses = async () => {
    try {
      setLoadingWarehouses(true);
      const data = await getMyWarehouses();
      // Filtra apenas almoxarifados ativos
      const activeWarehouses = data.filter(w => w.status === "ativo");
      setWarehouses(activeWarehouses);
    } catch (err) {
      console.error("Erro ao buscar almoxarifados:", err.message);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  // Buscar almoxarifados do usuário ao carregar
  useEffect(() => {
    if (user) {
      fetchWarehouses();
    }
  }, [user]);

  // Função para buscar itens do almoxarifado
  const fetchStockItems = async () => {
    if (!selectedWarehouseId) {
      setStockItems([]);
      return;
    }

    try {
      setLoadingItems(true);
      const data = await getItemsByWarehouse(selectedWarehouseId);
      setStockItems(data);
    } catch (err) {
      console.error("Erro ao buscar itens do estoque:", err.message);
      setStockItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // Buscar itens quando selecionar um almoxarifado
  useEffect(() => {
    fetchStockItems();
  }, [selectedWarehouseId]);

  // Obter nome do almoxarifado selecionado
  const selectedWarehouse = warehouses.find(
    (w) => String(w.id_almoxarifado) === String(selectedWarehouseId)
  );

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
            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Estoque
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <WarehouseSelector
                warehouses={warehouses}
                selectedId={selectedWarehouseId}
                onSelect={setSelectedWarehouseId}
                loading={loadingWarehouses}
              />
            </Box>
            <WarehouseFormModal onCreated={fetchWarehouses} />
          </Box>

          <StockTable
            items={stockItems}
            loading={loadingItems}
            warehouseName={selectedWarehouse?.nome}
          />

          {/* FAB para adicionar item ao estoque */}
          {selectedWarehouseId && (
            <Fab
              color="primary"
              onClick={() => setModalOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
              }}
            >
              <AddIcon />
            </Fab>
          )}

          {/* Modal de adicionar item */}
          <Modal
            title="Adicionar Item ao Estoque"
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          >
            <AddStockForm
              warehouseId={selectedWarehouseId}
              warehouseName={selectedWarehouse?.nome}
              onClose={() => setModalOpen(false)}
              onSaved={fetchStockItems}
            />
          </Modal>
        </Container>
      </Box>
    </Box>
  );
}

