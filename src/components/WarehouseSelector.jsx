import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function WarehouseSelector({
  warehouses,
  selectedId,
  onSelect,
  loading,
}) {
  // Encontrar o warehouse selecionado
  const selectedWarehouse =
    warehouses?.find((w) => String(w.id_almoxarifado) === String(selectedId)) ||
    null;

  // Handler para mudança de seleção
  const handleChange = (event, newValue) => {
    onSelect(newValue ? String(newValue.id_almoxarifado) : null);
  };

  // Caso não tenha almoxarifados
  if (!loading && (!warehouses || warehouses.length === 0)) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="warning">
          Você não é responsável por nenhum almoxarifado.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3, minWidth: 300, maxWidth: 400 }}>
      <Autocomplete
        value={selectedWarehouse}
        onChange={handleChange}
        options={warehouses || []}
        getOptionLabel={(option) => option.nome || ''}
        loading={loading}
        loadingText="Carregando..."
        noOptionsText="Nenhum almoxarifado encontrado"
        isOptionEqualToValue={(option, value) =>
          option.id_almoxarifado === value.id_almoxarifado
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Selecione o Almoxarifado"
            placeholder="Digite para buscar..."
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                color: '#333',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                },
              },
              '& .MuiInputBase-input': {
                color: '#333',
              },
              '& .MuiInputLabel-root': {
                color: '#00000048',
                fontWeight: 600,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#16a34a',
                fontWeight: 700,
                backgroundColor: '#fff',
                padding: '0 4px',
                borderRadius: '4px',
              },
              '& .MuiInputLabel-root.MuiFormLabel-filled': {
                color: '#16a34a',
                fontWeight: 700,
                backgroundColor: '#fff',
                padding: '0 4px',
                borderRadius: '4px',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: '#16a34a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#16a34a',
                  borderWidth: '2px',
                },
              },
              '& .MuiAutocomplete-endAdornment': {
                '& .MuiSvgIcon-root': {
                  color: '#333',
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
}
