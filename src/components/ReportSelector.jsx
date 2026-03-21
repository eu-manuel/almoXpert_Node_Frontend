/**
 * ReportSelector — Grid de cards clicáveis para selecionar um relatório.
 *
 * Props:
 *  - selected: string | null   — tipo do relatório selecionado
 *  - onSelect: (tipo) => void  — callback ao clicar
 */

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const REPORTS = [
  {
    tipo: 'posicao-estoque',
    titulo: 'Posição de Estoque',
    descricao: 'Visão geral de quantidades e valores por almoxarifado.',
    icon: <InventoryIcon sx={{ fontSize: 38 }} />,
  },
  {
    tipo: 'estoque-minimo',
    titulo: 'Estoque Mínimo',
    descricao: 'Itens abaixo do estoque mínimo com nível de urgência.',
    icon: <WarningAmberIcon sx={{ fontSize: 38 }} />,
  },
  {
    tipo: 'curva-abc',
    titulo: 'Curva ABC',
    descricao: 'Classificação de itens por valor de consumo (A/B/C).',
    icon: <ShowChartIcon sx={{ fontSize: 38 }} />,
  },
  {
    tipo: 'movimentacoes',
    titulo: 'Movimentações',
    descricao: 'Histórico de movimentações por período e filtros.',
    icon: <SwapHorizIcon sx={{ fontSize: 38 }} />,
  },
  {
    tipo: 'estoque-parado',
    titulo: 'Estoque Parado',
    descricao: 'Itens sem movimentação há muitos dias — capital parado.',
    icon: <HourglassEmptyIcon sx={{ fontSize: 38 }} />,
  },
];

export default function ReportSelector({ selected, onSelect }) {
  return (
    <Grid container spacing={2}>
      {REPORTS.map((r) => {
        const isSelected = selected === r.tipo;
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={r.tipo}>
            <Card
              elevation={isSelected ? 6 : 1}
              sx={{
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? 'primary.main' : 'divider',
                borderStyle: 'solid',
                bgcolor: isSelected ? 'rgba(22,163,74,0.08)' : 'background.paper',
                transition: 'all 0.2s',
                height: '100%',
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'rgba(22,163,74,0.04)',
                },
              }}
            >
              <CardActionArea
                onClick={() => onSelect(r.tipo)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 0 }}
              >
                <CardContent sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      color: isSelected ? 'primary.main' : 'text.secondary',
                      mb: 1,
                    }}
                  >
                    {r.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: isSelected ? 'primary.main' : 'text.primary' }}
                  >
                    {r.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {r.descricao}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
