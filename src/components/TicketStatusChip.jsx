import React from 'react';
import { Chip, Tooltip } from '@mui/material';

const STATUS_CONFIG = {
  aberto: {
    label: 'Aberto',
    color: 'info',
    description: 'O ticket foi criado e aguarda envio para validação pelo solicitante.',
  },
  enviado_validacao: {
    label: 'Enviado p/ Validação',
    color: 'warning',
    description: 'O ticket foi enviado e aguarda análise e decisão do atendente.',
  },
  aprovado: {
    label: 'Aprovado',
    color: 'success',
    description: 'O pedido foi aprovado e os itens estão liberados para entrega.',
  },
  recusado: {
    label: 'Recusado',
    color: 'error',
    description: 'O pedido foi recusado pelo atendente. O solicitante pode corrigir e reenviar.',
  },
  aguardando_conclusao: {
    label: 'Aguardando Conclusão',
    color: 'warning',
    description: 'O ticket está em espera até que uma pendência seja resolvida (ex: itens de emergência).',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'default',
    description: 'O ticket foi cancelado definitivamente e não pode mais ser alterado.',
  },
};

export default function TicketStatusChip({ status, size = 'small' }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' };

  return (
    <Tooltip title={config.description || ''} arrow placement="top">
      <Chip
        label={config.label}
        color={config.color}
        size={size}
        sx={{ fontWeight: 600, minWidth: 100, cursor: 'default' }}
      />
    </Tooltip>
  );
}
