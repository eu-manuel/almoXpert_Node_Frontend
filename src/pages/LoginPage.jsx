import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import { UserContext } from "../context/UserContext";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    // salva no contexto
    setUser(userData);

    // opcional: salvar no localStorage para manter login após recarregar
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    // redireciona para dashboard
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a3a 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src="/Logo Pequena AlmoXpert.png"
            alt="logo Almoxpert"
            sx={{
              width: 80,
              height: 80,
              mb: 2,
            }}
          />
          
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
            }}
          >
            AlmoXpert
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sistema de Gestão de Almoxarifado
          </Typography>

          {/* AuthPage agora cuida de alternar entre LoginForm e RegisterForm */}
          <AuthPage onLogin={handleLogin} />
        </Paper>
      </Container>
    </Box>
  );
}
