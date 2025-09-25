import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    // salva no contexto
    setUser(userData);
 

    // opcional: salvar no localStorage para manter o login ao recarregar
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
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
