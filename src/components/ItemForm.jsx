// components/ItemForm.js
import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/itemServices';
import ItemCategoriesModal from './ItemCategoriesModal';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Typography,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CategoryIcon from '@mui/icons-material/Category';

export default function ItemForm({ onClose, onSaved, itemToEdit }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    codigo_interno: '',
    unidade_medida: '',
    estoque_minimo: '',
    estoque_maximo: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para o modal de categorias
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [itemCategories, setItemCategories] = useState([]);

  // Se for edição, preencher com os dados existentes
  useEffect(() => {
    if (itemToEdit) {
      setForm(itemToEdit);
      // Se o item tiver categorias, armazenar localmente
      if (itemToEdit.Categories && itemToEdit.Categories.length > 0) {
        setItemCategories(itemToEdit.Categories);
      }
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const handleCategoriesUpdated = (updatedItem) => {
    // Atualizar categorias locais quando modal faz mudanças
    if (updatedItem && updatedItem.Categories) {
      setItemCategories(updatedItem.Categories);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepara os dados do item (SEM categorias)
      const itemData = { ...form };

      if (itemToEdit) {
        await updateItem(itemToEdit.id_item, itemData);
      } else {
        await createItem(itemData);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar item:', err);
      setError('Erro ao salvar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'descontinuado', label: 'Descontinuado' },
  ];

  const unidadeOptions = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (l)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'm', label: 'Metro (m)' },
    { value: 'cm', label: 'Centímetro (cm)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'pct', label: 'Pacote (pct)' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="nome"
            label="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="descricao"
            label="Descrição"
            value={form.descricao}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="codigo_interno"
            label="Código Interno"
            value={form.codigo_interno}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            name="unidade_medida"
            label="Unidade de Medida"
            value={form.unidade_medida}
            onChange={handleChange}
          >
            {unidadeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            name="estoque_minimo"
            label="Estoque Mínimo"
            value={form.estoque_minimo}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            name="estoque_maximo"
            label="Estoque Máximo"
            value={form.estoque_maximo}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
              Categorias
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, minHeight: 32 }}>
              {itemCategories.length > 0 ? (
                itemCategories.map((cat) => (
                  <Chip
                    key={cat.id_categoria}
                    label={cat.nome}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma categoria vinculada
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CategoryIcon />}
              onClick={() => setCategoriesModalOpen(true)}
              disabled={!itemToEdit}
              fullWidth
            >
              Gerenciar Categorias
            </Button>
            {!itemToEdit && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Salve o item primeiro para gerenciar categorias
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            name="status"
            label="Status"
            value={form.status}
            onChange={handleChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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
          onClick={onClose}
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
          {loading ? 'Salvando...' : itemToEdit ? 'Atualizar' : 'Salvar'}
        </Button>
      </Box>

      {/* Modal de gerenciamento de categorias */}
      {itemToEdit && (
        <ItemCategoriesModal
          open={categoriesModalOpen}
          onClose={() => setCategoriesModalOpen(false)}
          item={itemToEdit}
          onCategoriesChanged={handleCategoriesUpdated}
        />
      )}
    </Box>
  );
}
