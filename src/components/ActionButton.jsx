"use client";

import styles from "./ActionButton.module.css";

export default function ActionButton({
  children,
  type = "button",
  variant = "maroon",
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
}) {
  const variantClass = styles[variant] || styles.maroon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${variantClass} ${
        fullWidth ? styles.fullWidth : ""
      } ${className}`.trim()}
    >
      {children}
    </button>
  );
}
