import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import SupplierTable from "../components/SupplierTable";
import SupplierFormModal from "../components/SupplierFormModal";
import styles from "./SupplierPage.module.css";
import { UserContext } from "../context/UserContext";

export default function SupplierPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // ⚡ controla atualização da tabela
  const { user } = useContext(UserContext);

  if (!user) return <p>Carregando...</p>;

  return (
    <div className={styles.pageContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div
        className={styles.mainContent}
        style={{ marginLeft: menuOpen ? "250px" : "0" }}
      >
        <h1>Fornecedores</h1>
        <br />
        <SupplierTable refreshFlag={refreshFlag} />
        <SupplierFormModal onCreated={() => setRefreshFlag(prev => !prev)} />
      </div>
    </div>
  );
}
