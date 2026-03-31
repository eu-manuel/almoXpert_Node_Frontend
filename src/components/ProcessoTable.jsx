import { useEffect, useState } from 'react';
import {
  getProcessos,
  deleteProcesso,
  getProcessoById,
} from '../services/processoServices';
import ProcessoStatusChip from './ProcessoStatusChip';
import ProcessoItemTable from './ProcessoItemTable';
import ProcessoFormModal from './ProcessoFormModal';
import ConcluirProcessoModal from './ConcluirProcessoModal';
import CancelarProcessoModal from './CancelarProcessoModal';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BlockIcon from '@mui/icons-material/Block';

const ProcessoTable = ({ refreshFlag, onEdit }) => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedProcesso, setExpandedProcesso] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [concluirModalOpen, setConcluirModalOpen] = useState(false);
  const [processoToConcluir, setProcessoToConcluir] = useState(null);
  const [cancelarModalOpen, setCancelarModalOpen] = useState(false);
  const [processoToCancelar, setProcessoToCancelar] = useState(null);

  const fetchProcessos = async () => {
    try {
      setLoading(true);
      const data = await getProcessos();
      setProcessos(data);
    } catch (err) {
      console.error('Erro ao buscar processos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este processo e todos os seus itens?'))
      return;
    try {
      await deleteProcesso(id);
      setProcessos((prev) => prev.filter((p) => p.id_processo !== id));
      setSnackbar({
        open: true,
        message: 'Processo excluído com sucesso!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erro ao excluir processo',
        severity: 'error',
      });
    }
  };

  // Expandir/contrair linha para ver itens
  const handleToggleExpand = async (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
      setExpandedProcesso(null);
      return;
    }

    try {
      const processo = await getProcessoById(id);
      setExpandedProcesso(processo);
      setExpandedRow(id);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err.message);
    }
  };

  // Refresh dos itens do processo expandido
  const handleRefreshExpanded = async () => {
    if (expandedRow) {
      try {
        const processo = await getProcessoById(expandedRow);
        setExpandedProcesso(processo);
        // Atualizar também na lista
        setProcessos((prev) =>
          prev.map((p) => (p.id_processo === expandedRow ? processo : p))
        );
      } catch (err) {
        console.error('Erro ao atualizar detalhes:', err.message);
      }
    }
  };

  useEffect(() => {
    fetchProcessos();
  }, [refreshFlag]);

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando processos...</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50} />
              <TableCell>N° Processo</TableCell>
              <TableCell>Almoxarifado</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Valor Previsto</TableCell>
              <TableCell align="right">Valor Total</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processos.length > 0 ? (
              processos.map((p) => {
                const isDivergent = p.status === 'divergente';
                const isExpanded = expandedRow === p.id_processo;
                const isFinalized = ['concluido', 'concluido_com_faltas', 'cancelado'].includes(p.status);

                return (
                  <>
                    <TableRow
                      key={p.id_processo}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        ...(isDivergent && {
                          borderLeft: '3px solid',
                          borderColor: 'error.main',
                        }),
                      }}
                    >
                      {/* Botão expandir */}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleExpand(p.id_processo)}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <AssignmentIcon fontSize="small" color="primary" />
                          <Typography fontWeight={500}>
                            {p.numero_processo}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        {p.Warehouse?.nome || '-'}
                      </TableCell>

                      <TableCell
                        align="center"
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        <ProcessoStatusChip status={p.status} />
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        {formatCurrency(p.valor_previsto)}
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          {isDivergent && (
                            <Tooltip title="Valor divergente do previsto">
                              <WarningAmberIcon
                                fontSize="small"
                                color="error"
                              />
                            </Tooltip>
                          )}
                          <Typography
                            fontWeight={500}
                            color={isDivergent ? 'error.main' : 'inherit'}
                          >
                            {formatCurrency(p.valor_total)}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        onClick={() => handleToggleExpand(p.id_processo)}
                      >
                        {formatDate(p.data_abertura)}
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 0.5,
                          }}
                        >
                          {!isFinalized && (
                            <>
                              <Tooltip title="Concluir">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={async () => {
                                    try {
                                      const full = await getProcessoById(p.id_processo);
                                      setProcessoToConcluir(full);
                                      setConcluirModalOpen(true);
                                    } catch (err) {
                                      console.error('Erro ao buscar processo:', err.message);
                                    }
                                  }}
                                >
                                  <DoneAllIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancelar">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => {
                                    setProcessoToCancelar(p);
                                    setCancelarModalOpen(true);
                                  }}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => onEdit?.(p)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(p.id_processo)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Linha expandida com itens */}
                    <TableRow key={`${p.id_processo}-expanded`}>
                      <TableCell
                        colSpan={8}
                        sx={{ p: 0, borderBottom: isExpanded ? undefined : 0 }}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                            {/* Alerta de divergência */}
                            {isDivergent && (
                              <Alert severity="warning" sx={{ mb: 2 }}>
                                <strong>Processo divergente!</strong> Algum item
                                não foi entregue. O valor total (
                                {formatCurrency(p.valor_total)}) difere do
                                previsto ({formatCurrency(p.valor_previsto)}).
                              </Alert>
                            )}

                            {expandedProcesso && (
                              <ProcessoItemTable
                                processoItems={
                                  expandedProcesso.ProcessoItems || []
                                }
                                idProcesso={p.id_processo}
                                onRefresh={handleRefreshExpanded}
                                readOnly={isFinalized}
                              />
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <AssignmentIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                  />
                  <Typography color="text.secondary">
                    Nenhum processo encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal de conclusão */}
      <ConcluirProcessoModal
        processo={processoToConcluir}
        open={concluirModalOpen}
        onClose={() => {
          setConcluirModalOpen(false);
          setProcessoToConcluir(null);
        }}
        onConcluded={() => {
          setSnackbar({
            open: true,
            message: 'Processo concluído com sucesso! Itens registrados no estoque.',
            severity: 'success',
          });
          fetchProcessos();
        }}
      />

      {/* Modal de cancelamento */}
      <CancelarProcessoModal
        processo={processoToCancelar}
        open={cancelarModalOpen}
        onClose={() => {
          setCancelarModalOpen(false);
          setProcessoToCancelar(null);
        }}
        onCancelled={() => {
          setSnackbar({
            open: true,
            message: 'Processo cancelado com sucesso.',
            severity: 'info',
          });
          fetchProcessos();
        }}
      />
    </>
  );
};

export default ProcessoTable;
