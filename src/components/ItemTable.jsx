import React, { useEffect, useState } from "react";
import styles from "./ItemTable.module.css";

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Usuário não autenticado");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status}`);
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Erro ao buscar itens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Carregando itens...</p>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Código Interno</th>
            <th>Unidade</th>
            <th>Estoque Mínimo</th>
            <th>Quantidade em estoque</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id_item}>
                <td>{item.id_item}</td>
                <td>{item.nome}</td>
                <td>{item.descricao}</td>
                <td>{item.codigo_interno}</td>
                <td>{item.unidade_medida}</td>
                <td>{item.estoque_minimo}</td>
                <td>{item.estoque_maximo}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nenhum item encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
