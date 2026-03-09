/**
 * ReportsPage — Página principal do módulo de relatórios.
 *
 * Fluxo: Selecionar relatório → Configurar filtros → Gerar → Pré-visualizar → Exportar
 */

import { useState, useContext, useCallback } from 'react';
import SideNav from '../components/SideNav';
import ReportSelector from '../components/ReportSelector';
import ReportFilters from '../components/ReportFilters';
import ReportPreview from '../components/ReportPreview';
import { UserContext } from '../context/UserContext';
import { getReportData, exportReport } from '../services/reportServices';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Collapse,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function ReportsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

  // Estado do relatório
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Ao selecionar um relatório, limpa dados e filtros anteriores
  const handleSelectReport = useCallback((tipo) => {
    setSelectedReport(tipo);
    setFilters({});
    setReportData(null);
    setError(null);
  }, []);

  // Gerar relatório (pré-visualização JSON)
  const handleGenerate = useCallback(async () => {
    if (!selectedReport) return;
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      // Remove filtros vazios
      const cleanFilters = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v != null) cleanFilters[k] = v;
      });

      const data = await getReportData(selectedReport, cleanFilters);
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedReport, filters]);

  // Exportar PDF ou Excel
  const handleExport = useCallback(async (formato) => {
    if (!selectedReport) return;
    setExporting(true);

    try {
      const cleanFilters = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v != null) cleanFilters[k] = v;
      });

      await exportReport(selectedReport, formato, cleanFilters);
      setSnackbar({ open: true, message: `Arquivo ${formato.toUpperCase()} exportado com sucesso!`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setExporting(false);
    }
  }, [selectedReport, filters]);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
          {/* ── Cabeçalho ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Relatórios
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Selecione um relatório, configure os filtros e visualize os dados antes de exportar.
          </Typography>

          {/* ── Seletor de Relatório ── */}
          <ReportSelector selected={selectedReport} onSelect={handleSelectReport} />

          {/* ── Filtros (aparece ao selecionar relatório) ── */}
          <Collapse in={!!selectedReport} timeout={300}>
            <Box sx={{ mt: 3 }}>
              <ReportFilters
                reportType={selectedReport}
                filters={filters}
                onChange={setFilters}
                onGenerate={handleGenerate}
                loading={loading}
              />
            </Box>
          </Collapse>

          {/* ── Erro ── */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* ── Loading ── */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* ── Pré-visualização ── */}
          {!loading && reportData && (
            <ReportPreview
              data={reportData}
              reportType={selectedReport}
              filters={filters}
              onExport={handleExport}
              exporting={exporting}
            />
          )}
        </Container>
      </Box>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
