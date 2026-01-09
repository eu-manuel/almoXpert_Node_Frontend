import React, { useState, useEffect } from "react";
import { getItems } from "../services/itemServices";
import { createItemWarehouse } from "../services/itemWarehouseServices";
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

export default function AddStockForm({ warehouseId, warehouseName, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [form, setForm] = useState({
    quantidade: "",
    observacao: "",
  });

  // Buscar lista de itens cadastrados
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error("Erro ao buscar itens:", err.message);
        setError("Erro ao carregar itens");
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!selectedItem) {
      setError("Selecione um item");
      return;
    }
    
    if (!form.quantidade || form.quantidade <= 0) {
      setError("Informe uma quantidade válida");
      return;
    }

    try {
      setSubmitting(true);
      await createItemWarehouse({
        id_item: Number(selectedItem.id_item),
        id_almoxarifado: Number(warehouseId),
        quantidade: Number(form.quantidade),
        data_entrada: new Date().toISOString(),
        observacao: form.observacao || "Entrada de estoque",
      });
      
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Erro ao adicionar item:", err.message);
      setError("Erro ao adicionar item ao estoque: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ pt: 1 }}
    >
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
        <Autocomplete
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
          {submitting ? "Salvando..." : "Adicionar ao Estoque"}
        </Button>
      </Box>
    </Box>
  );
}
