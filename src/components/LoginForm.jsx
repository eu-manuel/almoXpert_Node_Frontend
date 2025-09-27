import { useState } from "react";
import { login } from "../services/api";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, senha);
      const token = data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      onLogin({ email: payload.email, cargo: payload.cargo, id: payload.id, token });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <button className={styles.button} type="submit">Entrar</button>

      <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
        Cadastre-se
      </a>

      {error && <p style={{ color: "red", margin: "0px" }}>{error}</p>}
    </form>
  );
}
