// components/ItemForm.js
import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/itemServices';
import { Box, TextField, Button, Grid, MenuItem, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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

  // Se for edição, preencher com os dados existentes
  useEffect(() => {
    if (itemToEdit) setForm(itemToEdit);
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (itemToEdit) {
        await updateItem(itemToEdit.id_item, form);
      } else {
        await createItem(form);
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

        <Grid size={{ xs: 12 }}>
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
    </Box>
  );
}
