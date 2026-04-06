import { useState, useEffect } from 'react';
import {
  getItemCategories,
  addCategoryToItem,
  removeCategoryFromItem,
} from '../services/itemCategoryServices';
import { searchCategories, findOrCreateCategory } from '../services/categoryServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  IconButton,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';

export default function ItemCategoriesModal({ open, onClose, item, onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para o autocomplete
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  // Buscar categorias do item ao abrir modal
  useEffect(() => {
    if (open && item) {
      fetchCategories();
      setError('');
      setSuccess('');
      setSelectedCategory(null);
      setInputValue('');
    }
  }, [open, item]);

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
        // Filtrar categorias que já estão vinculadas
        const filtered = results.filter(
          (r) => !categories.some((c) => c.id_categoria === r.id_categoria)
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
  }, [inputValue, categories]);

  const fetchCategories = async () => {
    if (!item) return;
    try {
      setLoading(true);
      const data = await getItemCategories(item.id_item);
      setCategories(data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Erro ao carregar categorias do item.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!selectedCategory) return;

    setAddingCategory(true);
    setError('');
    setSuccess('');

    try {
      let categoriaId;

      // Se for categoria nova (criar on-the-fly)
      if (selectedCategory.isNew) {
        const { category } = await findOrCreateCategory(selectedCategory.inputValue);
        categoriaId = category.id_categoria;
      } else {
        categoriaId = selectedCategory.id_categoria;
      }

      // Adicionar categoria ao item
      const result = await addCategoryToItem(item.id_item, categoriaId);
      
      // Atualizar lista de categorias
      setCategories(result.item.Categories || []);
      
      // Resetar campos
      setSelectedCategory(null);
      setInputValue('');
      
      // Feedback de sucesso
      setSuccess('Categoria adicionada com sucesso!');
      
      // Notificar componente pai
      if (onCategoriesChanged) {
        onCategoriesChanged(result.item);
      }
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      setError(err.message || 'Erro ao adicionar categoria.');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleRemoveCategory = async (categoriaId) => {
    if (!window.confirm('Deseja remover esta categoria do item?')) return;

    setError('');
    setSuccess('');

    try {
      const result = await removeCategoryFromItem(item.id_item, categoriaId);
      
      // Atualizar lista de categorias
      setCategories(result.item.Categories || []);
      
      // Feedback de sucesso
      setSuccess('Categoria removida com sucesso!');
      
      // Notificar componente pai
      if (onCategoriesChanged) {
        onCategoriesChanged(result.item);
      }
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
      setError(err.message || 'Erro ao remover categoria.');
    }
  };

  if (!item) return null;

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
              {item.nome}
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
        {/* Mensagens de erro/sucesso */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Seção: Categorias atuais */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Categorias vinculadas ({categories.length})
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : categories.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category.id_categoria}
                  label={category.nome}
                  color="info"
                  variant="outlined"
                  onDelete={() => handleRemoveCategory(category.id_categoria)}
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
                if (option.isNew) {
                  return option.inputValue;
                }
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
                
                // Sempre adicionar opção de criar nova ao final
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
              onClick={handleAddCategory}
              disabled={!selectedCategory || addingCategory}
              startIcon={addingCategory ? <CircularProgress size={16} /> : <AddIcon />}
              sx={{ minWidth: 120 }}
            >
              {addingCategory ? 'Adicionando...' : 'Adicionar'}
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
