import { useState, useEffect, useContext } from 'react';
import SideNav from '../components/SideNav';
import KpiCards from '../components/KpiCards';
import BarChartComponent from '../components/BarChartComponent';
import PieChartComponent from '../components/PieChartComponent';
import CriticalStockTable from '../components/CriticalStockTable';
import RecentMovementsTable from '../components/RecentMovementsTable';
import { getDashboardStats } from '../services/dashboardServices';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erro ao carregar dados do dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: `${COLLAPSED_WIDTH}px` },
          transition: 'margin 0.3s',
          ...(menuOpen && { ml: { md: `${DRAWER_WIDTH}px` } }),
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Dashboard
            </Typography>
          </Box>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={48} />
            </Box>
          )}

          {/* Error */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Conteúdo do Dashboard */}
          {!loading && !error && stats && (
            <Grid container spacing={3}>
              {/* KPI Cards */}
              <Grid size={12}>
                <KpiCards kpis={stats.kpis} />
              </Grid>

              {/* Gráfico de Barras — Entradas vs Saídas */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BarChartIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Movimentações por Mês
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                    <BarChartComponent data={stats.movimentacoesPorMes} />
                  </Box>
                </Paper>
              </Grid>

              {/* Gráfico de Pizza — Itens por Categoria */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PieChartIcon sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Itens por Categoria
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                    <PieChartComponent data={stats.itensPorCategoria} />
                  </Box>
                </Paper>
              </Grid>

              {/* Tabela — Estoque Crítico */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <WarningAmberIcon sx={{ color: '#f59e0b' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Estoque Crítico
                    </Typography>
                  </Box>
                  <CriticalStockTable data={stats.itensEstoqueCritico} />
                </Paper>
              </Grid>

              {/* Tabela — Últimas Movimentações */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <HistoryIcon sx={{ color: '#3b82f6' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Últimas Movimentações
                    </Typography>
                  </Box>
                  <RecentMovementsTable data={stats.ultimasMovimentacoes} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
