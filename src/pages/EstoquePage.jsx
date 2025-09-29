import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import ItemTable from "../components/ItemTable";
import styles from "./EstoquePage.module.css";
import { UserContext } from "../context/UserContext";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext); // pega o usuário do contexto

  if (!user) return <p>Carregando...</p>; // opcional: enquanto carrega o user

  return (
    <div className={styles.pageContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.mainContent}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Estoque</h1>
        <ItemTable />
      </div>
    </div>
  );
}
