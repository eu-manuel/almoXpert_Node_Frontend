import { useState } from "react";
import styles from "./SideNav.module.css";

export default function SideNav({ open, setOpen }) {
  return (
    <>
      <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
        ☰
      </button>

      <nav className={`${styles.sidenav} ${open ? styles.open : ""}`}>
        <h2 className={styles.logo}>AlmoXpert</h2>
        <a href="">Dashboard</a>
        <a href="#">Estoque</a>
        <a href="#">Fornecedores</a>
        <a href="#">Movimentações</a>
        <a href="#">Configurações</a>
      </nav>
    </>
  );
}
