// components/ItemForm.js
import React, { useState, useEffect, useRef } from 'react';
import { createItem, updateItem } from '../services/itemServices';
import { addCategoryToItem, removeCategoryFromItem } from '../services/itemCategoryServices';
import { findOrCreateCategory } from '../services/categoryServices';
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

  // Lista de categorias exibida no form (estado local, não salvo ainda)
  const [itemCategories, setItemCategories] = useState([]);

  // Intenções pendentes: categorias a adicionar e a remover ao salvar
  // toAdd: array de { inputValue: string } (novas) ou { id_categoria, nome } (existentes)
  // toRemove: array de id_categoria
  const [pendingAdd, setPendingAdd] = useState([]);
  const [pendingRemove, setPendingRemove] = useState([]);

  const categoriesInitialized = useRef(false);

  // Se for edição, preencher com os dados existentes
  useEffect(() => {
    if (itemToEdit) {
      setForm(itemToEdit);
      if (!categoriesInitialized.current) {
        setItemCategories(itemToEdit.Categories || []);
        categoriesInitialized.current = true;
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

  // Chamado pelo modal quando o usuário quer adicionar uma categoria
  // category pode ser: { id_categoria, nome } (existente) ou { isNew: true, inputValue } (nova)
  const handleAddCategory = (category) => {
    // Se for nova categoria (ainda sem id), adiciona direto à lista visual com id temporário
    if (category.isNew) {
      const tempId = `temp_${Date.now()}`;
      const newCat = { id_categoria: tempId, nome: category.inputValue, isNew: true };

      setItemCategories((prev) => [...prev, newCat]);
      setPendingAdd((prev) => [...prev, { tempId, inputValue: category.inputValue }]);
    } else {
      // Categoria existente — verificar se estava na fila de remoção
      setPendingRemove((prev) => prev.filter((id) => id !== category.id_categoria));

      // Só adiciona visualmente se ainda não estiver na lista
      setItemCategories((prev) => {
        if (prev.some((c) => c.id_categoria === category.id_categoria)) return prev;
        return [...prev, category];
      });

      // Adicionar à fila apenas se não estava na lista original
      const wasOriginal = (itemToEdit?.Categories || []).some(
        (c) => c.id_categoria === category.id_categoria
      );
      if (!wasOriginal) {
        setPendingAdd((prev) => [...prev, { id_categoria: category.id_categoria, nome: category.nome }]);
      }
    }
  };

  // Chamado pelo modal quando o usuário quer remover uma categoria
  const handleRemoveCategory = (categoriaId) => {
    // Remover da lista visual
    setItemCategories((prev) => prev.filter((c) => c.id_categoria !== categoriaId));

    // Se era uma adição pendente (temp ou existente), cancelar a adição
    const isInPendingAdd = pendingAdd.some(
      (p) => p.tempId === categoriaId || p.id_categoria === categoriaId
    );

    if (isInPendingAdd) {
      setPendingAdd((prev) =>
        prev.filter((p) => p.tempId !== categoriaId && p.id_categoria !== categoriaId)
      );
    } else {
      // Era uma categoria já salva — marcar para remoção
      setPendingRemove((prev) => [...prev, categoriaId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const itemData = { ...form };
      let savedItemId = itemToEdit?.id_item;

      if (itemToEdit) {
        await updateItem(itemToEdit.id_item, itemData);
      } else {
        const created = await createItem(itemData);
        savedItemId = created.id_item;
      }

      // Processar remoções pendentes
      for (const categoriaId of pendingRemove) {
        await removeCategoryFromItem(savedItemId, categoriaId);
      }

      // Processar adições pendentes
      for (const cat of pendingAdd) {
        let categoriaId;

        if (cat.inputValue) {
          // Categoria nova — buscar ou criar
          const { category } = await findOrCreateCategory(cat.inputValue);
          categoriaId = category.id_categoria;
        } else {
          categoriaId = cat.id_categoria;
        }

        await addCategoryToItem(savedItemId, categoriaId);
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
                    color={cat.isNew ? 'warning' : 'info'}
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
          currentCategories={itemCategories}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
      )}
    </Box>
  );
}