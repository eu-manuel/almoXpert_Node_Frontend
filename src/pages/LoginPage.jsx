import { useState } from "react";
import LoginForm from "../components/LoginForm";
import DashboardPage from "./DashboardPage";
import styles from "./LoginPage.module.css";





export default function LoginPage() {
  const [user, setUser] = useState(null);

  if (user) return <DashboardPage user={user} />;

  return (
    <div className={styles.container}>
      
      <img className={styles.imagem} src="/Logo Pequena AlmoXpert.png" alt="logo Almoxpert" />
      <LoginForm onLogin={setUser} />


      
    </div>
  );
}
