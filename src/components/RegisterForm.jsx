import { useState } from "react";
import { register } from "../services/api";
import styles from "./LoginForm.module.css";

export default function RegisterForm({ onSwitchToLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState(""); // se não quiser, pode remover
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(nome, email, senha, cargo);
      setSuccess("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        onSwitchToLogin(); // volta para tela de login depois do cadastro
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
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
      <input
        className={styles.input}
        type="text"
        placeholder="Cargo"
        value={cargo}
        onChange={(e) => setCargo(e.target.value)}
      />

      <button className={styles.button} type="submit">Cadastrar</button>

      <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
        Já tem conta? Entrar
      </a>

      {error && <p style={{ color: "red", margin: "0px" }}>{error}</p>}
      {success && <p style={{ color: "green", margin: "0px" }}>{success}</p>}
    </form>
  );
}
