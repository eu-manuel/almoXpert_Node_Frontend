import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import ItemTable from "../components/ItemTable";
import { UserContext } from "../context/UserContext";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function ItemsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
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
            <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Cadastro de Itens
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Gerencie os itens do seu inventário. Cadastre, edite ou remova itens.
          </Typography>

          <ItemTable />
        </Container>
      </Box>
    </Box>
  );
}
