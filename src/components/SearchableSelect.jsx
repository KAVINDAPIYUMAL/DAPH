"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SearchableSelect.module.css";

export default function SearchableSelect({
  id,
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "choose one of the following",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (!prev) setSearchTerm("");
      return !prev;
    });
  };

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={styles.fieldGroup} ref={containerRef}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`${styles.trigger} ${disabled ? styles.disabled : ""}`}
        >
          <span
            className={
              selectedOption ? styles.selectedText : styles.placeholderText
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={styles.caret}>▾</span>
        </button>

        {isOpen && !disabled && (
          <div className={styles.panel}>
            <div className={styles.searchWrap}>
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                placeholder="Search..."
              />
            </div>

            <ul className={styles.optionList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={`${opt.value}-${opt.label}`}
                    onClick={() => handleSelect(opt.value)}
                    className={`${styles.optionItem} ${
                      opt.value === value ? styles.selectedItem : ""
                    }`}
                  >
                    {opt.label}
                  </li>
                ))
              ) : (
                <li className={styles.emptyItem}>No matching options</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
