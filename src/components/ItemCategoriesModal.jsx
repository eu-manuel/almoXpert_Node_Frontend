import { useState, useEffect } from 'react';
import { searchCategories } from '../services/categoryServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Autocomplete,
  TextField,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';

export default function ItemCategoriesModal({
  open,
  onClose,
  currentCategories,   // array de categorias atual vindo do ItemForm
  onAddCategory,       // (category) => void — informa o pai sobre intenção de adicionar
  onRemoveCategory,    // (categoriaId) => void — informa o pai sobre intenção de remover
}) {
  // Estados para o autocomplete
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Limpar campo ao abrir o modal
  useEffect(() => {
    if (open) {
      setSelectedCategory(null);
      setInputValue('');
      setSearchResults([]);
    }
  }, [open]);

  // Buscar categorias com debounce
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (inputValue.length < 1) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchCategories(inputValue);
        // Filtrar categorias que já estão na lista local
        const filtered = results.filter(
          (r) => !currentCategories.some((c) => c.id_categoria === r.id_categoria)
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, currentCategories]);

  const handleAdd = () => {
    if (!selectedCategory) return;
    onAddCategory(selectedCategory);
    setSelectedCategory(null);
    setInputValue('');
  };

  const handleRemove = (categoriaId) => {
    if (!window.confirm('Deseja remover esta categoria do item?')) return;
    onRemoveCategory(categoriaId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: '90%', sm: 500 },
        },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon color="primary" />
          <Box>
            <Typography variant="h6" component="div">
              Categorias do Item
            </Typography>
            <Typography variant="caption" color="text.secondary">
              As alterações serão salvas ao clicar em "Atualizar"
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
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
        {/* Seção: Categorias atuais */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Categorias vinculadas ({currentCategories.length})
          </Typography>

          {currentCategories.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {currentCategories.map((category) => (
                <Chip
                  key={category.id_categoria}
                  label={category.isNew ? `${category.nome} (novo)` : category.nome}
                  color={category.isNew ? 'warning' : 'info'}
                  variant="outlined"
                  onDelete={() => handleRemove(category.id_categoria)}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Nenhuma categoria vinculada a este item.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Seção: Adicionar categoria */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Adicionar categoria
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Autocomplete
              fullWidth
              value={selectedCategory}
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={searchResults}
              getOptionLabel={(option) => {
                if (option.isNew) return option.inputValue;
                return option.nome || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (option.isNew || value.isNew) {
                  return option.inputValue === value.inputValue;
                }
                return option.id_categoria === value.id_categoria;
              }}
              filterOptions={(options, params) => {
                const { inputValue } = params;
                const filtered = [...options];
                if (inputValue.trim() !== '') {
                  filtered.push({
                    isNew: true,
                    inputValue: inputValue.trim(),
                    nome: `Criar categoria "${inputValue.trim()}"`,
                  });
                }
                return filtered;
              }}
              loading={searchLoading}
              loadingText="Buscando..."
              noOptionsText={
                inputValue.length < 1
                  ? 'Digite para buscar...'
                  : 'Digite para criar nova categoria'
              }
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                if (option.isNew) {
                  return (
                    <li key="create-new" {...restProps}>
                      <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography color="primary.main">
                        Criar categoria "{option.inputValue}"
                      </Typography>
                    </li>
                  );
                }
                return (
                  <li key={option.id_categoria} {...restProps}>
                    <CategoryIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    {option.nome}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Digite para buscar ou criar categoria..."
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!selectedCategory}
              startIcon={<AddIcon />}
              sx={{ minWidth: 120 }}
            >
              Adicionar
            </Button>
          </Box>
        </Box>

        {/* Botão fechar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
