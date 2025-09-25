import { useState } from "react";
import styles from "./SideNav.module.css";
import { Link } from "react-router-dom";


export default function SideNav({ open, setOpen }) {

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
        ☰
      </button>


      <nav className={`${styles.sidenav} ${open ? styles.open : ""}`}>
        <h2 className={styles.logo}>AlmoXpert</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/items">Estoque</Link>
        <Link to="/suppliers">Fornecedores</Link>
        <Link to="/movements">Movimentações</Link>
        <Link to="/settings">Configurações</Link>

        <button style={{ margin: "10px", marginTop: "50px" }} onClick={handleLogout} >LogOut</button>
      </nav>
    </>
  );
}
