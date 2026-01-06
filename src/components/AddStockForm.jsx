import React, { useState, useEffect } from "react";
import { getItems } from "../services/itemServices";
import { createItemWarehouse } from "../services/itemWarehouseServices";
import styles from "./AddStockForm.module.css";

export default function AddStockForm({ warehouseId, warehouseName, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    id_item: "",
    quantidade: "",
    observacao: "",
  });

  // Buscar lista de itens cadastrados
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error("Erro ao buscar itens:", err.message);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.id_item) {
      alert("Selecione um item");
      return;
    }
    
    if (!form.quantidade || form.quantidade <= 0) {
      alert("Informe uma quantidade válida");
      return;
    }

    try {
      setSubmitting(true);
      await createItemWarehouse({
        id_item: Number(form.id_item),
        id_almoxarifado: Number(warehouseId),
        quantidade: Number(form.quantidade),
        data_entrada: new Date().toISOString(),
        observacao: form.observacao || "Entrada de estoque",
      });
      
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Erro ao adicionar item:", err.message);
      alert("Erro ao adicionar item ao estoque: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.info}>
        Adicionando item ao almoxarifado: <strong>{warehouseName}</strong>
      </p>

      <div className={styles.field}>
        <label htmlFor="id_item">Item</label>
        {loadingItems ? (
          <select disabled>
            <option>Carregando itens...</option>
          </select>
        ) : (
          <select
            id="id_item"
            name="id_item"
            value={form.id_item}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecione um item --</option>
            {items.map((item) => (
              <option key={item.id_item} value={item.id_item}>
                {item.nome} ({item.codigo_interno || "sem código"})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="quantidade">Quantidade</label>
        <input
          type="number"
          id="quantidade"
          name="quantidade"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="observacao">Observação (opcional)</label>
        <input
          type="text"
          id="observacao"
          name="observacao"
          placeholder="Ex: Entrada inicial, Compra, etc."
          value={form.observacao}
          onChange={handleChange}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={submitting}>
          {submitting ? "Salvando..." : "Adicionar ao Estoque"}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelBtn}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
