import { useState, useContext } from 'react';
import SideNav from '../components/SideNav';
import BarChartComponent from '../components/BarChartComponent';
import LineChartComponent from '../components/LineChartComponent';
import PieChartComponent from '../components/PieChartComponent';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Dashboard
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 350,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Visão Geral
                </Typography>
                <BarChartComponent />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 350,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Distribuição
                </Typography>
                <PieChartComponent />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 350,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Tendências
                </Typography>
                <LineChartComponent />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
