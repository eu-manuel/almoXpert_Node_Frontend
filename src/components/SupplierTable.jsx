import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./SupplierTable.module.css";
import { getSuppliers, updateSupplier, deleteSupplier } from "../services/supplierServices";

const SupplierTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = async (supplier) => {
    const novoNome = prompt("Novo nome:", supplier.nome);
    if (!novoNome) return;
    try {
      const updated = await updateSupplier(supplier.id, { ...supplier, nome: novoNome });
      setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) return <p>Carregando fornecedores...</p>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nome}</td>
                <td>{s.CNPJ}</td>
                <td>{s.telefone}</td>
                <td>{s.email}</td>
                <td>{s.endereco}</td>
                <td>
                  <div className={styles.container}>
                    <button className={styles.editBtn} onClick={()=>handleEdit(s)}>
                      <Pencil size={18} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhum fornecedor encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
