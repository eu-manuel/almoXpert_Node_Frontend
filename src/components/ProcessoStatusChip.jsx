import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const statusConfig = {
  em_andamento: {
    label: 'Em Andamento',
    color: 'warning',
    icon: <HourglassEmptyIcon />,
  },
  concluido: {
    label: 'Concluído',
    color: 'success',
    icon: <CheckCircleIcon />,
  },
  divergente: {
    label: 'Divergente',
    color: 'error',
    icon: <WarningIcon />,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'default',
    icon: <CancelIcon />,
  },
  aguardando_conclusao: {
    label: 'Aguardando Conclusão',
    color: 'info',
    icon: <PendingActionsIcon />,
  },
  concluido_com_faltas: {
    label: 'Concluído c/ Faltas',
    color: 'warning',
    icon: <WarningAmberIcon />,
  },
};

export default function ProcessoStatusChip({ status, size = 'small' }) {
  const config = statusConfig[status] || statusConfig.em_andamento;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="outlined"
    />
  );
}
