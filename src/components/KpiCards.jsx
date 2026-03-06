import { Box, Paper, Typography, Grid } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WarehouseIcon from '@mui/icons-material/Warehouse';

const cards = [
  {
    key: 'totalItens',
    label: 'Total de Itens',
    icon: InventoryIcon,
    color: '#16a34a',
    bgColor: 'rgba(22, 163, 74, 0.12)',
  },
  {
    key: 'totalFornecedores',
    label: 'Fornecedores',
    icon: LocalShippingIcon,
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.12)',
  },
  {
    key: 'itensEstoqueBaixo',
    label: 'Estoque Baixo',
    icon: WarningAmberIcon,
    color: '#f59e0b',
    alertColor: '#ef4444',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    alertBgColor: 'rgba(239, 68, 68, 0.12)',
  },
  {
    key: 'totalEstoque',
    label: 'Total em Estoque',
    icon: WarehouseIcon,
    color: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.12)',
  },
];

export default function KpiCards({ kpis }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => {
        const Icon = card.icon;
        const value = kpis?.[card.key] ?? 0;
        const isAlert = card.key === 'itensEstoqueBaixo' && value > 0;
        const activeColor = isAlert ? card.alertColor : card.color;
        const activeBg = isAlert ? card.alertBgColor : card.bgColor;

        return (
          <Grid key={card.key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderLeft: `4px solid ${activeColor}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  backgroundColor: activeBg,
                  flexShrink: 0,
                }}
              >
                <Icon sx={{ fontSize: 28, color: activeColor }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: activeColor, lineHeight: 1.2 }}
                >
                  {value.toLocaleString('pt-BR')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {card.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
