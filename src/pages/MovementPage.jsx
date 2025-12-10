import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import MovementTable from "../components/MovementTable";
import styles from "./MovementPage.module.css";
import { UserContext } from "../context/UserContext";

export default function MovementPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { user } = useContext(UserContext);

  if (!user) return <p>Carregando...</p>;

  return (
    <div className={styles.pageContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.mainContent}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Histórico de Movimentações</h1>
        <p className={styles.subtitle}>
          Acompanhe todas as entradas, saídas, transferências e ajustes de estoque.
        </p>
        <MovementTable refreshFlag={refreshFlag} />
      </div>
    </div>
  );
}
