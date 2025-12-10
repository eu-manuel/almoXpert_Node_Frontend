import React, { useEffect, useState } from "react";
import styles from "./MovementTable.module.css";
import { getMovements } from "../services/movementServices";

const MovementTable = ({ refreshFlag }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const data = await getMovements();
      setMovements(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [refreshFlag]);

  // Formata o tipo da movimentação para exibição
  const formatTipo = (tipo) => {
    const tipos = {
      entrada: "Entrada",
      saida: "Saída",
      transferencia: "Transferência",
      ajuste: "Ajuste"
    };
    return tipos[tipo] || tipo;
  };

  // Formata a data para exibição
  const formatData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Retorna classe CSS baseada no tipo
  const getTipoClass = (tipo) => {
    const classes = {
      entrada: styles.tipoEntrada,
      saida: styles.tipoSaida,
      transferencia: styles.tipoTransferencia,
      ajuste: styles.tipoAjuste
    };
    return classes[tipo] || "";
  };

  if (loading) return <p>Carregando movimentações...</p>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Almoxarifado</th>
            <th>Usuário</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          {movements.length > 0 ? (
            movements.map((m) => (
              <tr key={m.id_movimentacao}>
                <td>{formatData(m.data_movimentacao)}</td>
                <td>
                  <span className={`${styles.tipoBadge} ${getTipoClass(m.tipo)}`}>
                    {formatTipo(m.tipo)}
                  </span>
                </td>
                <td>{m.Item?.nome || `ID: ${m.id_item}`}</td>
                <td>{m.quantidade}</td>
                <td>{m.Warehouse?.nome || `ID: ${m.id_almoxarifado}`}</td>
                <td>{m.User?.nome || `ID: ${m.id_usuario}`}</td>
                <td>{m.observacao || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhuma movimentação encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MovementTable;
