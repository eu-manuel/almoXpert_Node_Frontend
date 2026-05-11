import React, { useState, useEffect, useContext } from "react";
import { getItems } from "../services/itemServices";
import { createItemWarehouse } from "../services/itemWarehouseServices";
import { getCRs, getMeusCRs } from "../services/crServices";
import { getMe } from "../services/userServices";
import { UserContext } from "../context/UserContext";
import PERMISSIONS from "../constants/permissions";
import Modal from "./GenericModal";
import ItemForm from "./ItemForm";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddStockForm({
  warehouseId,
  warehouseName,
  onClose,
  onSaved,
}) {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [crs, setCRs] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingCRs, setLoadingCRs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCR, setSelectedCR] = useState(null);
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    quantidade: '',
    observacao: '',
  });

  // Buscar lista de itens cadastrados
  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const data = await getItems();
      setItems(data);
      return data;
    } catch (err) {
      console.error("Erro ao buscar itens:", err.message);
      setError("Erro ao carregar itens");
      return [];
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCRs();
  }, []);

  // Buscar CRs (admin/MANAGE_STOCK vê todos; demais vê apenas CRs vinculados)
  const fetchCRs = async () => {
    try {
      setLoadingCRs(true);

      // Sem usuário no contexto: mantém comportamento atual (meus CRs)
      if (!user) {
        const data = await getMeusCRs();
        setCRs(data);
        return;
      }

      // Admin vê tudo sem consultar permissões
      let allowedAll = !!user.isAdmin;

      if (!allowedAll) {
        const me = await getMe();
        const userPermissions = me.Permissions?.map((p) => p.nome) ?? [];
        allowedAll = userPermissions.includes(PERMISSIONS.MANAGE_STOCK);
      }

      const data = allowedAll ? await getCRs() : await getMeusCRs();
      setCRs(data);
    } catch (err) {
      console.error("Erro ao buscar CRs:", err.message);
    } finally {
      setLoadingCRs(false);
    }
  };

  // Callback quando um novo item é criado pelo ItemForm
  const handleItemCreated = async () => {
    const updatedItems = await fetchItems();
    // Seleciona automaticamente o último item criado (o mais recente)
    if (updatedItems.length > 0) {
      const newestItem = updatedItems[updatedItems.length - 1];
      setSelectedItem(newestItem);
    }
    setCreateItemModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedItem) {
      setError('Selecione um item');
      return;
    }

    if (!form.quantidade || form.quantidade <= 0) {
      setError('Informe uma quantidade válida');
      return;
    }

    try {
      setSubmitting(true);
      await createItemWarehouse({
        id_item: Number(selectedItem.id_item),
        id_almoxarifado: Number(warehouseId),
        quantidade: Number(form.quantidade),
        data_entrada: new Date().toISOString(),
        observacao: form.observacao || 'Entrada de estoque',
        cr_id: selectedCR ? Number(selectedCR.id_cr) : null,
      });

      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar item:', err.message);
      setError('Erro ao adicionar item ao estoque: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          p: 2,
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        <WarehouseIcon color="primary" />
        <Typography variant="body1">
          Adicionando item ao almoxarifado: <strong>{warehouseName}</strong>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Autocomplete
            sx={{ flex: 1 }}
            options={items}
            getOptionLabel={(option) => `${option.nome} (${option.codigo_interno || "sem código"})`}
            value={selectedItem}
            onChange={(_, newValue) => setSelectedItem(newValue)}
            loading={loadingItems}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingItems ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText="Nenhum item encontrado"
            loadingText="Carregando itens..."
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setCreateItemModalOpen(true)}
            sx={{ minWidth: 'auto', px: 1.5, height: 56 }}
            title="Criar novo item"
          >
            <AddCircleOutlineIcon />
          </Button>
        </Box>

        <Autocomplete
          options={crs}
          getOptionLabel={(option) => `${option.codigo}${option.descricao ? ` — ${option.descricao}` : ''}`}
          value={selectedCR}
          onChange={(_, newValue) => setSelectedCR(newValue)}
          loading={loadingCRs}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Centro de Responsabilidade (CR)"
              helperText="Opcional — associe este item a um CR para controle de planejamento"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCRs ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText="Nenhum CR encontrado (ou o seu usuario não tem acesso a nenhum)"
          loadingText="Carregando CRs..."
        />

        <TextField
          fullWidth
          type="number"
          name="quantidade"
          label="Quantidade"
          placeholder="Informe a quantidade"
          value={form.quantidade}
          onChange={handleChange}
          required
          inputProps={{ min: 1 }}
        />

        <TextField
          fullWidth
          name="observacao"
          label="Observação (opcional)"
          placeholder="Ex: Entrada inicial, Compra, etc."
          value={form.observacao}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          mt: 3,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={onClose}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={<AddIcon />}
        >
          {submitting ? 'Salvando...' : 'Adicionar ao Estoque'}
        </Button>
      </Box>

      {/* Modal para criar novo item */}
      <Modal
        title="Criar Novo Item"
        isOpen={createItemModalOpen}
        onClose={() => setCreateItemModalOpen(false)}
      >
        <ItemForm
          onClose={() => setCreateItemModalOpen(false)}
          onSaved={handleItemCreated}
        />
      </Modal>
    </Box>
  );
}
