import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import SupplierTable from "../components/SupplierTable";
import styles from "./SupplierPage.module.css";
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
        <h1>Fornecedores</h1>
        <br />
        <SupplierTable />
      </div>
    </div>
  );
}
