import { useState } from "react";
import SideNav from "../components/SideNav";
import styles from "./DashboardPage.module.css";
import ItemTable from "../components/ItemTable";

export default function DashboardPage({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.MainContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.BodyContainer}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user.email}!</p>
        <p>Cargo: {user.cargo}</p>
        <ItemTable />
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
