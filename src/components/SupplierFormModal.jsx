import { useState } from "react";
import styles from "./SupplierFormModal.module.css";
import { createSupplier } from "../services/supplierServices"; // rota de criação

export default function SupplierFormModal({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    CNPJ: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(form); // chama service
      onCreated?.(); // recarregar lista
      setForm({ nome: "", CNPJ: "", telefone: "", email: "", endereco: "" });
      setOpen(false);
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err);
      alert("Erro ao salvar fornecedor");
    }
  };

  return (
    <>
      {/* Botão para abrir modal */}
      <button className={styles.fab} onClick={() => setOpen(true)}>
        +
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Novo Fornecedor</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="CNPJ"
                placeholder="CNPJ"
                value={form.CNPJ}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                value={form.telefone}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={form.endereco}
                onChange={handleChange}
              />

              <div className={styles.actions}>
                <button type="submit" className={styles.saveBtn}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
