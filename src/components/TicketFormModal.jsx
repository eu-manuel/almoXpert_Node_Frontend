import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Autocomplete, Alert,
  CircularProgress, IconButton, Chip, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Modal from './GenericModal';
import { getMeusCRs } from '../services/crServices';
import { getItensByCR } from '../services/itemWarehouseServices';
import { createTicket } from '../services/ticketServices';

export default function TicketFormModal({ isOpen, onClose, onCreated }) {
  const [crs, setCRs] = useState([]);
  const [itensCR, setItensCR] = useState([]); // Itens disponíveis para o CR selecionado
  const [loadingCRs, setLoadingCRs] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
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
    }
  }, [isOpen]);

  // Quando o CR muda, buscar itens disponíveis para esse CR
  useEffect(() => {
    if (selectedCR) {
      fetchItensByCR(selectedCR.id_cr);
    } else {
      setItensCR([]);
    }
  }, [selectedCR]);

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

  const fetchItensByCR = async (crId) => {
    try {
      setLoadingItems(true);
      const data = await getItensByCR(crId);
      setItensCR(data);
    } catch (err) {
      console.error('Erro ao buscar itens do CR:', err.message);
      setItensCR([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const hasEmergencyItems = ticketItens.some((i) => !i.id_item);

  // Calcular a quantidade já alocada para um item no ticket (para limitar o max)
  const getQuantidadeJaAlocada = (idItem) => {
    return ticketItens
      .filter((i) => i.id_item === idItem)
      .reduce((sum, i) => sum + i.quantidade, 0);
  };

  // Calcular o máximo disponível para o item atualmente selecionado
  const getMaxQuantidade = () => {
    if (isManualItem || !currentItem) return undefined;
    const jaAlocado = getQuantidadeJaAlocada(currentItem.id_item);
    return currentItem.quantidade_disponivel - jaAlocado;
  };

  const handleCRChange = (_, newCR) => {
    if (selectedCR && ticketItens.length > 0 && newCR?.id_cr !== selectedCR?.id_cr) {
      // Limpar itens cadastrados ao trocar de CR (manter itens manuais se houver)
      const itensManual = ticketItens.filter((i) => !i.id_item);
      setTicketItens(itensManual);
    }
    setSelectedCR(newCR);
    // Resetar item selecionado
    setCurrentItem(null);
    setCurrentQtd('');
  };

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
      const qtd = Number(currentQtd);
      const maxDisponivel = getMaxQuantidade();

      // Validação de segurança: impedir quantidade acima do disponível
      if (maxDisponivel !== undefined && qtd > maxDisponivel) {
        setError(`Quantidade máxima disponível para "${currentItem.nome}": ${maxDisponivel}`);
        return;
      }

      setTicketItens((prev) => [
        ...prev,
        {
          id_item: currentItem.id_item,
          nome_item: currentItem.nome,
          quantidade: qtd,
          quantidade_disponivel: currentItem.quantidade_disponivel,
          almoxarifados: currentItem.almoxarifados,
        },
      ]);
    }
    setCurrentItem(null);
    setCurrentNomeManual('');
    setCurrentQtd('');
    setError('');
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
        itens: ticketItens.map((i) => ({
          id_item: i.id_item,
          nome_item: i.nome_item,
          quantidade: i.quantidade,
        })),
        mensagem: mensagem.trim(),
        justificativa_emergencia: hasEmergencyItems ? justificativa.trim() : null,
      });
      // Reset form
      setTitulo('');
      setMensagem('');
      setJustificativa('');
      setTicketItens([]);
      setSelectedCR(null);
      setItensCR([]);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const maxQtd = getMaxQuantidade();
  const maxAtingido = maxQtd !== undefined && maxQtd <= 0;

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
          onChange={handleCRChange}
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
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {item.nome_item}
                  {!item.id_item && (
                    <Chip label="Fora do planejamento" size="small" color="warning" sx={{ ml: 1 }} />
                  )}
                </Typography>
                {item.almoxarifados && item.almoxarifados.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {item.almoxarifados.map((alm) => (
                      <Tooltip
                        key={alm.id_almoxarifado}
                        title={`${alm.quantidade} un. disponíveis neste almoxarifado`}
                      >
                        <Chip
                          label={`${alm.nome_almoxarifado}: ${alm.quantidade}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                )}
              </Box>
              <Chip label={`Qtd: ${item.quantidade}`} size="small" variant="outlined" />
              {item.quantidade_disponivel && (
                <Chip
                  label={`Disp: ${item.quantidade_disponivel}`}
                  size="small"
                  variant="outlined"
                  color="info"
                />
              )}
              <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {/* Aviso se nenhum CR selecionado */}
          {!selectedCR && !isManualItem && (
            <Alert severity="info" variant="outlined" sx={{ mb: 1 }}>
              Selecione um CR acima para ver os itens disponíveis.
            </Alert>
          )}

          {/* Aviso se CR selecionado mas sem itens */}
          {selectedCR && !loadingItems && itensCR.length === 0 && !isManualItem && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 1 }} icon={<WarningAmberIcon />}>
              Nenhum item cadastrado no estoque para o CR selecionado.
              Use o modo <strong>Manual</strong> para solicitar via ticket de emergência.
            </Alert>
          )}

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
                options={itensCR}
                getOptionLabel={(opt) =>
                  `${opt.nome} (${opt.codigo_interno || 'sem código'}) — Disp: ${opt.quantidade_disponivel} ${opt.unidade_medida || ''}`
                }
                value={currentItem}
                onChange={(_, v) => {
                  setCurrentItem(v);
                  setCurrentQtd('');
                }}
                loading={loadingItems}
                disabled={!selectedCR}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={selectedCR ? 'Selecionar item disponível' : 'Selecione um CR primeiro'}
                  />
                )}
                noOptionsText={
                  selectedCR
                    ? 'Nenhum item disponível para este CR'
                    : 'Selecione um CR primeiro'
                }
                isOptionEqualToValue={(option, value) => option.id_item === value.id_item}
              />
            )}

            <Tooltip
              title={
                maxAtingido
                  ? 'Quantidade máxima já adicionada ao ticket'
                  : maxQtd !== undefined
                    ? `Máximo disponível: ${maxQtd}`
                    : ''
              }
            >
              <TextField
                size="small"
                type="number"
                label={maxQtd !== undefined ? `Qtd (máx: ${maxQtd})` : 'Qtd'}
                value={currentQtd}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isManualItem && maxQtd !== undefined && val > maxQtd) {
                    setCurrentQtd(String(maxQtd));
                  } else {
                    setCurrentQtd(e.target.value);
                  }
                }}
                sx={{ width: 120 }}
                inputProps={{
                  min: 1,
                  ...(maxQtd !== undefined && { max: maxQtd }),
                }}
                disabled={maxAtingido}
              />
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddItem}
              disabled={
                isManualItem
                  ? !currentNomeManual.trim() || !currentQtd
                  : !currentItem || !currentQtd || maxAtingido
              }
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
