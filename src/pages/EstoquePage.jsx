import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import ItemTable from "../components/ItemTable";
import styles from "./DashboardPage.module.css";
import { UserContext } from "../context/UserContext";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext); // pega o usuário do contexto

  if (!user) return <p>Carregando...</p>; // opcional: enquanto carrega o user

  return (
    <div className={styles.MainContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.BodyContainer}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Estoque</h1>
        <p>Bem-vindo, {user.email}!</p>
        <p>Cargo: {user.cargo}</p>
        <ItemTable />
      </div>
    </div>
  );
}
