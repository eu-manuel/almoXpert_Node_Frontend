import { useState, useContext } from "react";
import SideNav from "../components/SideNav";
import ItemTable from "../components/ItemTable";
import styles from "./DashboardPage.module.css";
import BarChartComponent from "../components/BarChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import { UserContext } from "../context/UserContext";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext); // pega o usuário do contexto

  if (!user) return <p>Carregando...</p>; // opcional: enquanto carrega o user

  return (
    <div className={styles.DASHMainContainer}>
      <SideNav open={menuOpen} setOpen={setMenuOpen} />
      <div className={styles.DASHBodyContainer} style={{ marginLeft: menuOpen ? "250px" : "0" }}>
        <div>
          <h1>Dashboard</h1>
            <div className={styles.DASHChartContainer}>
              <div><BarChartComponent /></div>
              <div><PieChartComponent /></div>
              <div><LineChartComponent /></div>
            </div>
        </div>
      </div>
    </div>
  );
}
