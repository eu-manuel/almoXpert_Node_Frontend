import { useState } from "react";
import { login } from "../services/api";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, senha);
      
      // data não traz o usuário completo? se não, podemos buscar depois
      const token = data.token;

      // decodificar token para pegar dados do usuário (opcional)
      const payload = JSON.parse(atob(token.split(".")[1]));

      onLogin({ email: payload.email, cargo: payload.cargo, id: payload.id });
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
        <a href="">Cadastre-se</a>
        {error && <p style={{ color: "red" , paddingTop:"0px", margin:"0px"}}>{error}</p>}
         
      </form>
     
    
  );
}
