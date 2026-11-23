"use client";

import styles from "./PageHeader.module.css";

export default function PageHeader({ title, actions = null, className = "" }) {
  return (
    <div className={`${styles.headerRow} ${className}`.trim()}>
      <h2 className={styles.title}>{title}</h2>
      {actions && <div className={styles.actionsGroup}>{actions}</div>}
    </div>
  );
}
