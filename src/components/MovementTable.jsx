import React, { useEffect, useState } from "react";
import { getMovements } from "../services/movementServices";
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
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TuneIcon from "@mui/icons-material/Tune";

const MovementTable = ({ refreshFlag }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const data = await getMovements();
      setMovements(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [refreshFlag]);

  // Formata o tipo da movimentação para exibição
  const formatTipo = (tipo) => {
    const tipos = {
      entrada: "Entrada",
      saida: "Saída",
      transferencia: "Transferência",
      ajuste: "Ajuste"
    };
    return tipos[tipo] || tipo;
  };

  // Formata a data para exibição
  const formatData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Retorna cor e ícone baseado no tipo
  const getTipoConfig = (tipo) => {
    const config = {
      entrada: { color: "success", icon: <ArrowDownwardIcon fontSize="small" /> },
      saida: { color: "error", icon: <ArrowUpwardIcon fontSize="small" /> },
      transferencia: { color: "info", icon: <SwapHorizIcon fontSize="small" /> },
      ajuste: { color: "warning", icon: <TuneIcon fontSize="small" /> }
    };
    return config[tipo] || { color: "default", icon: null };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando movimentações...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Item</TableCell>
            <TableCell align="center">Quantidade</TableCell>
            <TableCell>Almoxarifado</TableCell>
            <TableCell>Usuário</TableCell>
            <TableCell>Observação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.length > 0 ? (
            movements.map((m) => {
              const tipoConfig = getTipoConfig(m.tipo);
              return (
                <TableRow key={m.id_movimentacao}>
                  <TableCell>{formatData(m.data_movimentacao)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={tipoConfig.icon}
                      label={formatTipo(m.tipo)}
                      color={tipoConfig.color}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>{m.Item?.nome || `ID: ${m.id_item}`}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: m.tipo === 'entrada' ? 'success.main' : m.tipo === 'saida' ? 'error.main' : 'text.primary'
                      }}
                    >
                      {m.tipo === 'entrada' ? '+' : m.tipo === 'saida' ? '-' : ''}{m.quantidade}
                    </Typography>
                  </TableCell>
                  <TableCell>{m.Warehouse?.nome || `ID: ${m.id_almoxarifado}`}</TableCell>
                  <TableCell>{m.User?.nome || `ID: ${m.id_usuario}`}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.observacao || "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  Nenhuma movimentação encontrada
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovementTable;
