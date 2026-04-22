import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Autocomplete, Alert,
  CircularProgress, IconButton, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from './GenericModal';
import { getMeusCRs } from '../services/crServices';
import { getItems } from '../services/itemServices';
import { createTicket } from '../services/ticketServices';

export default function TicketFormModal({ isOpen, onClose, onCreated }) {
  const [crs, setCRs] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingCRs, setLoadingCRs] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedCR, setSelectedCR] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [ticketItens, setTicketItens] = useState([]);

  // Item being added
  const [currentItem, setCurrentItem] = useState(null);
  const [currentNomeManual, setCurrentNomeManual] = useState('');
  const [currentQtd, setCurrentQtd] = useState('');
  const [isManualItem, setIsManualItem] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCRs();
      fetchItems();
    }
  }, [isOpen]);

  const fetchCRs = async () => {
    try {
      setLoadingCRs(true);
      const data = await getMeusCRs();
      setCRs(data);
    } catch (err) {
      console.error('Erro ao buscar CRs:', err.message);
    } finally {
      setLoadingCRs(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error('Erro ao buscar itens:', err.message);
    } finally {
      setLoadingItems(false);
    }
  };

  const hasEmergencyItems = ticketItens.some((i) => !i.id_item);

  const handleAddItem = () => {
    if (isManualItem) {
      if (!currentNomeManual.trim() || !currentQtd) return;
      setTicketItens((prev) => [
        ...prev,
        {
          id_item: null,
          nome_item: currentNomeManual.trim(),
          quantidade: Number(currentQtd),
        },
      ]);
    } else {
      if (!currentItem || !currentQtd) return;
      setTicketItens((prev) => [
        ...prev,
        {
          id_item: currentItem.id_item,
          nome_item: currentItem.nome,
          quantidade: Number(currentQtd),
        },
      ]);
    }
    setCurrentItem(null);
    setCurrentNomeManual('');
    setCurrentQtd('');
  };

  const handleRemoveItem = (index) => {
    setTicketItens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCR) return setError('Selecione um Centro de Responsabilidade.');
    if (!titulo.trim()) return setError('Informe o título do ticket.');
    if (ticketItens.length === 0) return setError('Adicione pelo menos um item.');
    if (!mensagem.trim()) return setError('Informe a mensagem inicial.');
    if (hasEmergencyItems && !justificativa.trim()) {
      return setError('Justificativa é obrigatória para itens fora do planejamento.');
    }

    try {
      setSubmitting(true);
      await createTicket({
        titulo: titulo.trim(),
        cr_id: selectedCR.id_cr,
        itens: ticketItens,
        mensagem: mensagem.trim(),
        justificativa_emergencia: hasEmergencyItems ? justificativa.trim() : null,
      });
      // Reset form
      setTitulo('');
      setMensagem('');
      setJustificativa('');
      setTicketItens([]);
      setSelectedCR(null);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Abrir Novo Ticket de Pedido" isOpen={isOpen} onClose={onClose} maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        <TextField
          fullWidth
          label="Título do Ticket"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ex: Pedido de material de escritório"
        />

        <Autocomplete
          options={crs}
          getOptionLabel={(opt) => `${opt.codigo}${opt.descricao ? ` — ${opt.descricao}` : ''}`}
          value={selectedCR}
          onChange={(_, v) => setSelectedCR(v)}
          loading={loadingCRs}
          renderInput={(params) => (
            <TextField {...params} label="Centro de Responsabilidade (CR)" required />
          )}
          noOptionsText="Nenhum CR vinculado ao seu perfil"
        />

        {/* Lista de itens do ticket */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Itens do Pedido ({ticketItens.length})
          </Typography>

          {ticketItens.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, mb: 1,
                p: 1, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: item.id_item ? 'divider' : 'warning.main',
              }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {item.nome_item}
                {!item.id_item && (
                  <Chip label="Fora do planejamento" size="small" color="warning" sx={{ ml: 1 }} />
                )}
              </Typography>
              <Chip label={`Qtd: ${item.quantidade}`} size="small" variant="outlined" />
              <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {/* Form para adicionar item */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              variant={isManualItem ? 'contained' : 'outlined'}
              onClick={() => setIsManualItem(!isManualItem)}
              sx={{ minWidth: 'auto', fontSize: '0.7rem' }}
            >
              {isManualItem ? 'Cadastrado' : 'Manual'}
            </Button>

            {isManualItem ? (
              <TextField
                size="small"
                label="Nome do item"
                value={currentNomeManual}
                onChange={(e) => setCurrentNomeManual(e.target.value)}
                sx={{ flex: 1 }}
              />
            ) : (
              <Autocomplete
                size="small"
                sx={{ flex: 1 }}
                options={items}
                getOptionLabel={(opt) => `${opt.nome} (${opt.codigo_interno || 'sem código'})`}
                value={currentItem}
                onChange={(_, v) => setCurrentItem(v)}
                loading={loadingItems}
                renderInput={(params) => (
                  <TextField {...params} label="Selecionar item cadastrado" />
                )}
                noOptionsText="Nenhum item encontrado"
              />
            )}

            <TextField
              size="small"
              type="number"
              label="Qtd"
              value={currentQtd}
              onChange={(e) => setCurrentQtd(e.target.value)}
              sx={{ width: 80 }}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddItem}
              disabled={isManualItem ? !currentNomeManual.trim() || !currentQtd : !currentItem || !currentQtd}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>
        </Box>

        {/* Alerta de emergência */}
        {hasEmergencyItems && (
          <Alert severity="warning" variant="outlined">
            Este ticket contém itens fora do planejamento e será classificado como <strong>emergência</strong>.
            A justificativa abaixo é obrigatória.
          </Alert>
        )}

        {hasEmergencyItems && (
          <TextField
            fullWidth
            label="Justificativa de Emergência"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            required
            multiline
            rows={2}
            placeholder="Explique por que este pedido é emergencial..."
          />
        )}

        <TextField
          fullWidth
          label="Mensagem Inicial"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required
          multiline
          rows={3}
          placeholder="Descreva seu pedido com detalhes..."
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="inherit" onClick={onClose} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={submitting} startIcon={<AddIcon />}>
            {submitting ? 'Criando...' : 'Criar Ticket'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
