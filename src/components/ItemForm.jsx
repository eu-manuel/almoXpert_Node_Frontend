// components/ItemForm.js
import React, { useState, useEffect } from "react";
import { createItem, updateItem } from "../services/itemServices";
import styles from "./ItemForm.module.css";

export default function ItemForm({ onClose, onSaved, itemToEdit }) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    codigo_interno: "",
    unidade_medida: "",
    estoque_minimo: "",
    estoque_maximo: "",
    status: "",
  });

  // Se for edição, preencher com os dados existentes
  useEffect(() => {
    if (itemToEdit) setForm(itemToEdit);
  }, [itemToEdit]);

 const handleChange = (e) => {
  const { name, value, type } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "number" && value !== ""
      ? Number(value)
      : value,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (itemToEdit) {
        await updateItem(itemToEdit.id_item, form);
      } else {
        await createItem(form);
      }
      onSaved?.(); // recarregar lista
      onClose();   // fechar modal
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      alert("Erro ao salvar item");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
      <input type="text" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
      <input type="text" name="codigo_interno" placeholder="Código Interno" value={form.codigo_interno} onChange={handleChange} />
      <input type="text" name="unidade_medida" placeholder="Unidade de Medida" value={form.unidade_medida} onChange={handleChange} />
      <input type="number" name="estoque_minimo" placeholder="Estoque Mínimo" value={form.estoque_minimo} onChange={handleChange} />
      <input type="number" name="estoque_maximo" placeholder="Quantidade em Estoque" value={form.estoque_maximo} onChange={handleChange} />
      <input type="text" name="status" placeholder="Status" value={form.status} onChange={handleChange} />

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>
          {itemToEdit ? "Atualizar" : "Salvar"}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelBtn}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
