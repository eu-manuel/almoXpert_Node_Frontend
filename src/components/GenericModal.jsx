import React from "react";
import styles from "./GenericModal.module.css";

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>X</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
