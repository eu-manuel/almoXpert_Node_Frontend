import { useState, useEffect, useContext } from 'react';
import SideNav from '../components/SideNav';
import { UserContext } from '../context/UserContext';
import { getMe, updateProfile, deactivateAccount } from '../services/userServices';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function SettingsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  // Formulário de perfil
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal de desativação
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');

  // Carrega dados do perfil ao montar
  useEffect(() => {
    getMe()
      .then((data) => {
        setForm({ nome: data.nome || '', email: data.email || '', senha: '' });
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Envia apenas campos preenchidos
      const updateData = {};
      if (form.nome) updateData.nome = form.nome;
      if (form.email) updateData.email = form.email;
      if (form.senha) updateData.senha = form.senha;

      if (Object.keys(updateData).length === 0) {
        setError('Altere pelo menos um campo antes de salvar.');
        setLoading(false);
        return;
      }

      await updateProfile(updateData);
      setSuccess('Perfil atualizado com sucesso!');
      setForm((prev) => ({ ...prev, senha: '' }));
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setDeactivateLoading(true);
    setDeactivateError('');

    try {
      await deactivateAccount();

      // Limpa sessão e redireciona
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      setDeactivateError(err.message || 'Erro ao desativar conta.');
      setDeactivateLoading(false);
    }
  };

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
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              Configurações
            </Typography>
          </Box>

          {/* === Seção Perfil === */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Meu Perfil
            </Typography>

            <Box component="form" onSubmit={handleSaveProfile}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  name="nome"
                  label="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type="password"
                  name="senha"
                  label="Nova Senha (deixe vazio para manter)"
                  value={form.senha}
                  onChange={handleChange}
                  helperText="Preencha apenas se deseja alterar a senha. Mínimo 6 caracteres."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* === Seção Desativar Conta === */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'error.dark',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <WarningAmberIcon color="error" />
              <Typography variant="h6" fontWeight={600} color="error.main">
                Zona de Perigo
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ao desativar sua conta, você perderá acesso imediatamente ao
              sistema. Seus dados serão preservados, mas você não conseguirá
              fazer login até que um administrador reative sua conta.
            </Typography>

            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => setDeactivateOpen(true)}
            >
              Desativar Minha Conta
            </Button>
          </Paper>

          {/* === Dialog de Confirmação === */}
          <Dialog
            open={deactivateOpen}
            onClose={() => setDeactivateOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 600 }}>
              Confirmar Desativação
            </DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Esta ação irá desativar sua conta imediatamente. Você será
                desconectado e não poderá acessar o sistema até que um
                administrador reative sua conta.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Tem certeza que deseja continuar?
              </Typography>

              {deactivateError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {deactivateError}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setDeactivateOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={deactivateLoading}
                onClick={handleDeactivate}
              >
                {deactivateLoading ? 'Desativando...' : 'Sim, Desativar Minha Conta'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}
