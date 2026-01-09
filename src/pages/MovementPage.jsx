import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import MovementTable from "../components/MovementTable";
import { UserContext } from "../context/UserContext";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function MovementPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { user } = useContext(UserContext);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SwapHorizIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Histórico de Movimentações
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Acompanhe todas as entradas, saídas, transferências e ajustes de estoque.
          </Typography>

          <MovementTable refreshFlag={refreshFlag} />
        </Container>
      </Box>
    </Box>
  );
}
