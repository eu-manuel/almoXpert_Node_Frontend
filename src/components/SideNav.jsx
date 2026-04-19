import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Box, Divider, useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PeopleIcon from "@mui/icons-material/People";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import almoXlogo from "/Logo Pequena AlmoXpert.png";
import { UserContext } from '../context/UserContext';
import { getMe } from '../services/userServices';
import PERMISSIONS from '../constants/permissions';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const ALL_MENU_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon />, permission: null },
  { name: "Cadastro Itens", path: "/items", icon: <CategoryIcon />, permission: PERMISSIONS.EDIT_ITEMS },
  { name: "Estoque", path: "/stock", icon: <InventoryIcon />, permission: PERMISSIONS.MANAGE_STOCK },
  { name: "Almoxarifados", path: "/warehouses", icon: <WarehouseIcon />, permission: PERMISSIONS.MANAGE_WAREHOUSES },
  { name: "Fornecedores", path: "/suppliers", icon: <PeopleIcon />, permission: PERMISSIONS.MANAGE_SUPPLIERS },
  { name: "Movimentações", path: "/movements", icon: <SwapHorizIcon />, permission: PERMISSIONS.MANAGE_MOVEMENTS },
  { name: "Processos", path: "/processos", icon: <AssignmentIcon />, permission: PERMISSIONS.MANAGE_PROCESSOS },
  { name: "Relatórios", path: "/reports", icon: <AssessmentIcon />, permission: PERMISSIONS.VIEW_REPORTS },
  { name: "Usuários", path: "/users", icon: <ManageAccountsIcon />, permission: PERMISSIONS.MANAGE_USERS },
  { name: "Configurações", path: "/settings", icon: <SettingsIcon />, permission: null },
];

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    // Admin vê tudo
    if (user.isAdmin) {
      setMenuItems(ALL_MENU_ITEMS);
      return;
    }

    // Usuário comum: busca as permissões dele e filtra o menu
    getMe()
      .then((userData) => {
        const userPermissions = userData.Permissions?.map((p) => p.nome) ?? [];

        const filtered = ALL_MENU_ITEMS.filter(
          (item) => item.permission === null || userPermissions.includes(item.permission)
        );

        setMenuItems(filtered);
      })
      .catch(() => {
        // Em caso de erro, mostra só os itens sem permissão exigida
        setMenuItems(ALL_MENU_ITEMS.filter((item) => item.permission === null));
      });
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.reload();
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
      {/* Toggle Button + Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          py: 2,
          minHeight: 64,
        }}
      >
        {open ? (
          <>
            <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'primary.main' }}>
              AlmoXpert
            </Box>
            <IconButton onClick={() => setOpen(!open)} size="small" sx={{ color: 'text.secondary' }}>
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'text.secondary' }}>
            <Box
              component="img"
              src={almoXlogo}
              alt="Logo AlmoXpert"
              sx={{ width: 40, height: 40, pointerEvents: 'none' }}
            />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 1 }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 'auto' }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 40 : 'auto',
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.name} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 1 }} />

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: open ? 'flex-start' : 'center',
              px: open ? 2 : 'auto',
              color: 'error.main',
              '&:hover': { backgroundColor: 'rgba(207, 27, 27, 0.1)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: open ? 40 : 'auto', color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Sair" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && !open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed', top: 12, left: 12,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper', boxShadow: 2,
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? DRAWER_WIDTH : open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}