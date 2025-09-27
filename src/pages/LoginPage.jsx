import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/AuthPage"; // vai alternar entre login e cadastro
import styles from "./LoginPage.module.css";
import { UserContext } from "../context/UserContext";

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
    <div className={styles.container}>
      <img
        className={styles.imagem}
        src="/Logo Pequena AlmoXpert.png"
        alt="logo Almoxpert"
      />

      {/* AuthPage agora cuida de alternar entre LoginForm e RegisterForm */}
      <AuthPage onLogin={handleLogin} />
    </div>
  );
}
