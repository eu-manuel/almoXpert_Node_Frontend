import { useState, useEffect } from "react";
import { createWarehouse, updateWarehouse } from "../services/warehouseServices";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Fab,
  Grid,
  IconButton,
  Alert,
  InputAdornment,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";

const emptyForm = {
  nome: "",
  descricao: "",
  localizacao: "",
  capacidade_maxima: "",
  status: "ativo",
};

export default function WarehouseFormModal({ 
  onCreated, 
  onSaved,
  warehouseToEdit = null,
  open: externalOpen,
  onClose: externalOnClose,
  showFab = true,
}) {
  // Se open externo é fornecido, usa ele; senão usa estado interno
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const isEditMode = !!warehouseToEdit;

  // Preencher formulário quando entrar em modo edição
  useEffect(() => {
    if (warehouseToEdit) {
      setForm({
        nome: warehouseToEdit.nome || "",
        descricao: warehouseToEdit.descricao || "",
        localizacao: warehouseToEdit.localizacao || "",
        capacidade_maxima: warehouseToEdit.capacidade_maxima || "",
        status: warehouseToEdit.status || "ativo",
      });
    } else {
      setForm(emptyForm);
    }
  }, [warehouseToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalOpen(false);
    }
    setError("");
    if (!isEditMode) {
      setForm(emptyForm);
    }
  };

  const handleOpen = () => {
    setInternalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação: nome é obrigatório
    if (!form.nome.trim()) {
      setError("O nome do almoxarifado é obrigatório.");
      setLoading(false);
      return;
    }

    try {
      // Prepara dados, convertendo capacidade para número se preenchido
      const dataToSend = {
        ...form,
        capacidade_maxima: form.capacidade_maxima ? parseInt(form.capacidade_maxima, 10) : null,
      };

      if (isEditMode) {
        await updateWarehouse(warehouseToEdit.id_almoxarifado, dataToSend);
        onSaved?.();
      } else {
        await createWarehouse(dataToSend);
        onCreated?.();
      }
      
      setForm(emptyForm);
      handleClose();
    } catch (err) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} almoxarifado:`, err);
      setError(err.message || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} almoxarifado. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB para abrir modal (apenas modo criação) */}
      {showFab && !isEditMode && (
        <Tooltip title="Criar novo almoxarifado">
          <Fab
            color="secondary"
            size="medium"
            onClick={handleOpen}
            sx={{ flexShrink: 0 }}
          >
            <AddBusinessIcon />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
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
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
            {isEditMode ? <EditIcon color="primary" /> : <WarehouseIcon color="primary" />}
            {isEditMode ? "Editar Almoxarifado" : "Novo Almoxarifado"}
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2.5}>
              {/* Nome - obrigatório */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="nome"
                  label="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Almoxarifado Central"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WarehouseIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Descrição */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="descricao"
                  label="Descrição"
                  value={form.descricao}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Descrição do almoxarifado (opcional)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Localização */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="localizacao"
                  label="Localização"
                  value={form.localizacao}
                  onChange={handleChange}
                  placeholder="Ex: Prédio A, Sala 101"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Capacidade Máxima */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="capacidade_maxima"
                  label="Capacidade Máxima"
                  type="number"
                  value={form.capacidade_maxima}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2Icon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </TextField>
              </Grid>
            </Grid>

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
                onClick={handleClose}
                startIcon={<CancelIcon />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                {loading ? "Salvando..." : isEditMode ? "Atualizar" : "Salvar"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
