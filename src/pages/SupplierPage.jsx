import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import SupplierTable from "../components/SupplierTable";
import SupplierFormModal from "../components/SupplierFormModal";
import { UserContext } from "../context/UserContext";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function SupplierPage() {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Fornecedores
            </Typography>
          </Box>

          <SupplierTable refreshFlag={refreshFlag} />
          <SupplierFormModal onCreated={() => setRefreshFlag(prev => !prev)} />
        </Container>
      </Box>
    </Box>
  );
}
