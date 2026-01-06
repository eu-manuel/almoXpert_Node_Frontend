import React from "react";
import styles from "./WarehouseSelector.module.css";

export default function WarehouseSelector({ warehouses, selectedId, onSelect, loading }) {
  if (loading) {
    return (
      <div className={styles.container}>
        <label className={styles.label}>Almoxarifado</label>
        <select className={styles.select} disabled>
          <option>Carregando...</option>
        </select>
      </div>
    );
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className={styles.container}>
        <label className={styles.label}>Almoxarifado</label>
        <div className={styles.noWarehouses}>
          Você não é responsável por nenhum almoxarifado.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="warehouse-select">
        Selecione o Almoxarifado
      </label>
      <select
        id="warehouse-select"
        className={styles.select}
        value={selectedId || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Selecione --</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id_almoxarifado} value={warehouse.id_almoxarifado}>
            {warehouse.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
