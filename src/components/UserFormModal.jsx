import { useState, useEffect } from 'react';
import {
  createUser,
  updateUser,
} from '../services/userManagementServices';
import GenericModal from './GenericModal';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

/**
 * Modal de criação/edição de usuário.
 *
 * Props:
 *   - open: boolean — controla se o modal está aberto
 *   - onClose: function — chamado ao fechar
 *   - onSaved: function — chamado após salvar com sucesso (para refresh)
 *   - userToEdit: object|null — se fornecido, entra em modo edição
 */
export default function UserFormModal({ open, onClose, onSaved, userToEdit }) {
  const isEditing = Boolean(userToEdit);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    isAdmin: false,
  });

  // Preenche o formulário quando entra em modo edição
  useEffect(() => {
    if (userToEdit) {
      setForm({
        nome: userToEdit.nome || '',
        email: userToEdit.email || '',
        senha: '', // senha nunca é pré-preenchida
        isAdmin: userToEdit.isAdmin || false,
      });
    } else {
      setForm({ nome: '', email: '', senha: '', isAdmin: false });
    }
    setError('');
  }, [userToEdit, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        // Na edição, envia apenas os campos preenchidos
        const updateData = {};
        if (form.nome) updateData.nome = form.nome;
        if (form.email) updateData.email = form.email;
        if (form.senha) updateData.senha = form.senha; // só envia se preenchido
        updateData.isAdmin = form.isAdmin;

        await updateUser(userToEdit.id_usuario, updateData);
      } else {
        // Na criação, todos os campos são obrigatórios (exceto isAdmin)
        await createUser(form);
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      setError(err.message || 'Erro ao salvar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModal
      title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
      isOpen={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="nome"
              label="Nome"
              value={form.nome}
              onChange={handleChange}
              required={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              name="senha"
              label={isEditing ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}
              value={form.senha}
              onChange={handleChange}
              required={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText={
                isEditing
                  ? 'Preencha apenas se deseja alterar a senha.'
                  : 'Mínimo de 6 caracteres.'
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Administrador"
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={onClose}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </GenericModal>
  );
}
