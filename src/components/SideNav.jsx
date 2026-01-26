import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import almoXlogo from '/Logo Pequena AlmoXpert.png';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> },
    { name: 'Estoque', path: '/items', icon: <InventoryIcon /> },
    { name: 'Almoxarifados', path: '/warehouses', icon: <WarehouseIcon /> },
    { name: 'Fornecedores', path: '/suppliers', icon: <PeopleIcon /> },
    { name: 'Movimentações', path: '/movements', icon: <SwapHorizIcon /> },
    { name: 'Configurações', path: '/settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: 1,
      }}
    >
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
            <Box
              component="span"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              AlmoXpert
            </Box>
            <IconButton
              onClick={() => setOpen(!open)}
              size="small"
              sx={{
                color: 'text.secondary',
              }}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: 'text.secondary',
            }}
          >
            <Box
              component="img"
              src={almoXlogo}
              alt="Logo AlmoXpert"
              sx={{
                width: 40,
                height: 40,
                pointerEvents: 'none',
              }}
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
              sx={{
                justifyContent: open ? 'flex-start' : 'center',
                px: open ? 2 : 'auto',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 40 : 'auto',
                  color:
                    location.pathname === item.path
                      ? 'primary.main'
                      : 'text.secondary',
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

      {/* Logout Button */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: open ? 'flex-start' : 'center',
              px: open ? 2 : 'auto',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(207, 27, 27, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 'auto',
                color: 'error.main',
              }}
            >
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
      {/* Toggle Button for Mobile - outside the drawer */}
      {isMobile && !open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile
              ? DRAWER_WIDTH
              : open
                ? DRAWER_WIDTH
                : COLLAPSED_WIDTH,
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
