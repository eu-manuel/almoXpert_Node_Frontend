/**
 * ReportsPage — Página principal do módulo de relatórios.
 *
 * Fluxo: Selecionar relatório → Configurar filtros → Gerar → Pré-visualizar → Exportar
 *
 * Implementação completa na Tarefa 4.
 */

import { useState, useContext } from 'react';
import SideNav from '../components/SideNav';
import { UserContext } from '../context/UserContext';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function ReportsPage() {
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
            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Relatórios
            </Typography>
          </Box>

          {/* TODO: Tarefa 4 — ReportSelector + ReportFilters + ReportPreview */}
          <Typography color="text.secondary">
            Módulo de relatórios em construção. Componentes serão adicionados na Tarefa 4.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
