import React from 'react';
import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  aberto: { label: 'Aberto', color: 'info' },
  enviado_validacao: { label: 'Enviado p/ Validação', color: 'warning' },
  aprovado: { label: 'Aprovado', color: 'success' },
  recusado: { label: 'Recusado', color: 'error' },
  aguardando_conclusao: { label: 'Aguardando Conclusão', color: 'warning' },
  cancelado: { label: 'Cancelado', color: 'default' },
};

export default function TicketStatusChip({ status, size = 'small' }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 600, minWidth: 100 }}
    />
  );
}
