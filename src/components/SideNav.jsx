import { useState } from "react";
import styles from "./SideNav.module.css";
import { Link } from "react-router-dom";
import almoXlogo from "/Logo Pequena AlmoXpert.png"; // logo pequena
import {
  Home,
  Box,
  Users,
  Repeat,
  Settings,
  LogOut
} from "lucide-react";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home /> },
    { name: "Estoque", path: "/items", icon: <Box /> },
    { name: "Fornecedores", path: "/suppliers", icon: <Users /> },
    { name: "Movimentações", path: "/movements", icon: <Repeat /> },
    { name: "Configurações", path: "/settings", icon: <Settings /> },
  ];

  return (
    <>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <nav className={`${styles.sidenav} ${open ? styles.open : styles.closed}`}>
        <div className={styles.logo}>
          {open ? "AlmoXpert" : <img src={almoXlogo} alt="Logo AlmoXpert" />}
        </div>

        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className={styles.navItem}>
            {item.icon}
            {open && <span className={styles.linkText}>{item.name}</span>}
          </Link>
        ))}

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut />
          {open && <span className={styles.linkText}>Sair</span>}
        </button>
      </nav>
    </>
  );
}
