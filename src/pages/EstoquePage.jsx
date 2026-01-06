import { useState, useContext, useEffect } from "react";
import SideNav from "../components/SideNav";
import WarehouseSelector from "../components/WarehouseSelector";
import StockTable from "../components/StockTable";
import Modal from "../components/GenericModal";
import AddStockForm from "../components/AddStockForm";
import styles from "./EstoquePage.module.css";
import { UserContext } from "../context/UserContext";
import { getMyWarehouses } from "../services/warehouseServices";
import { getItemsByWarehouse } from "../services/itemWarehouseServices";

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

  // Buscar almoxarifados do usuário ao carregar
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoadingWarehouses(true);
        const data = await getMyWarehouses();
        setWarehouses(data);
      } catch (err) {
        console.error("Erro ao buscar almoxarifados:", err.message);
      } finally {
        setLoadingWarehouses(false);
      }
    };

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

  if (!user) return <p>Carregando...</p>;

  return (
    <div className={styles.pageContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.mainContent}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Estoque</h1>

        <WarehouseSelector
          warehouses={warehouses}
          selectedId={selectedWarehouseId}
          onSelect={setSelectedWarehouseId}
          loading={loadingWarehouses}
        />

        <StockTable
          items={stockItems}
          loading={loadingItems}
          warehouseName={selectedWarehouse?.nome}
        />

        {/* Botão FAB para adicionar item ao estoque */}
        {selectedWarehouseId && (
          <button 
            className={styles.fab} 
            onClick={() => setModalOpen(true)}
            title="Adicionar item ao estoque"
          >
            +
          </button>
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
      </div>
    </div>
  );
}

