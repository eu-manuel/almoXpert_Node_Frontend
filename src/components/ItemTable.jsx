import React, { useEffect, useState } from "react";
import { getItems, deleteItem } from "../services/itemServices";
import Modal from "./GenericModal";
import ItemForm from "./ItemForm";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./ItemTable.module.css";

export default function ItemTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id_item !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p>Carregando itens...</p>;

  return (
    <div className={styles.tableContainer}>
      <button className={styles.fab} onClick={() => { setItemToEdit(null); setModalOpen(true); }}>
        +
      </button>


      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Código Interno</th>
            <th>Unidade</th>
            <th>Estoque Mínimo</th>
            <th>Estoque Máximo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id_item}>
                <td>{item.nome}</td>
                <td>{item.descricao}</td>
                <td>{item.codigo_interno}</td>
                <td>{item.unidade_medida}</td>
                <td>{item.estoque_minimo}</td>
                <td>{item.estoque_maximo}</td>
                <td>{item.status}</td>
                <td>
                  <div className={styles.container}>
                    <button className={styles.editBtn} onClick={() => handleEdit(item)}><Pencil size={16} /></button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(item.id_item)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9">Nenhum item encontrado</td></tr>
          )}
        </tbody>
      </table>

      <Modal
        title={itemToEdit ? "Editar Item" : "Novo Item"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ItemForm
          itemToEdit={itemToEdit}
          onClose={() => setModalOpen(false)}
          onSaved={fetchItems}
        />
      </Modal>
    </div>
  );
}
