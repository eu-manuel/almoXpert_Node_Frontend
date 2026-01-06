import React from "react";
import styles from "./StockTable.module.css";

export default function StockTable({ items, loading, warehouseName }) {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <p className={styles.loadingText}>Carregando itens do estoque...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          {warehouseName 
            ? `Nenhum item encontrado no almoxarifado "${warehouseName}".`
            : "Selecione um almoxarifado para visualizar o estoque."
          }
        </div>
      </div>
    );
  }

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={styles.tableContainer}>
      {warehouseName && (
        <h3 className={styles.warehouseTitle}>Estoque: {warehouseName}</h3>
      )}
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome do Item</th>
            <th>Código</th>
            <th>Unidade</th>
            <th>Quantidade</th>
            <th>Data de Entrada</th>
          </tr>
        </thead>
        <tbody>
          {items.map((itemWarehouse) => (
            <tr key={itemWarehouse.id}>
              <td>{itemWarehouse.Item?.nome || "-"}</td>
              <td>{itemWarehouse.Item?.codigo_interno || "-"}</td>
              <td>{itemWarehouse.Item?.unidade_medida || "-"}</td>
              <td className={styles.quantityCell}>{itemWarehouse.quantidade}</td>
              <td>{formatDate(itemWarehouse.data_entrada)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        Total de itens: <strong>{items.length}</strong>
      </div>
    </div>
  );
}
