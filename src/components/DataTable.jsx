"use client";

import { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./DataTable.module.css";

export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = "No data available in table",
  pageSize = 10,
  exportFileName = "daph-table-export",
  pdfTitle = "Department of Animal Production & Health",
  showExportButtons = true,
  showEntriesDropdown = false,
  alwaysShowControls = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [copyFeedback, setCopyFeedback] = useState("");

  const hasData = Array.isArray(data) && data.length > 0;
  const displayControls = hasData || alwaysShowControls;

  const handleSort = (key) => {
    if (!key || !hasData) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredData = useMemo(() => {
    if (!hasData) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const val = row?.[col.key];
        return (
          val !== null &&
          val !== undefined &&
          String(val).toLowerCase().includes(query)
        );
      }),
    );
  }, [data, columns, searchQuery, hasData]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a?.[sortConfig.key] ?? "";
      const bVal = b?.[sortConfig.key] ?? "";

      const aNum = Number(aVal);
      const bNum = Number(bVal);

      if (
        !Number.isNaN(aNum) &&
        !Number.isNaN(bNum) &&
        String(aVal).trim() !== "" &&
        String(bVal).trim() !== ""
      ) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      const comparison = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const totalEntries = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, safeCurrentPage, rowsPerPage]);

  const startEntry =
    totalEntries === 0 ? 0 : (safeCurrentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(safeCurrentPage * rowsPerPage, totalEntries);

  const escapeDelimitedValue = (val, delimiter = ",") => {
    const str = val === null || val === undefined ? "" : String(val);
    const needsQuotes =
      str.includes(delimiter) || str.includes('"') || str.includes("\n");
    const escaped = str.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const escapeHtml = (val) => {
    const str = val === null || val === undefined ? "" : String(val);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const handleCopy = async () => {
    const headerRow = columns.map((c) => c.label).join("\t");
    const bodyRows = sortedData.map((row) =>
      columns.map((c) => row?.[c.key] ?? "").join("\t"),
    );
    const textToCopy = [headerRow, ...bodyRows].join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch {
      setCopyFeedback("Copy unavailable");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const downloadFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headerRow = columns
      .map((c) => escapeDelimitedValue(c.label, ","))
      .join(",");
    const bodyRows = sortedData.map((row) =>
      columns
        .map((c) => escapeDelimitedValue(row?.[c.key] ?? "", ","))
        .join(","),
    );
    const csvContent = [headerRow, ...bodyRows].join("\n");
    downloadFile(csvContent, "text/csv;charset=utf-8;", "csv");
  };

  const handleExportExcel = () => {
    const tableHeader = `<tr>${columns
      .map((c) => `<th>${escapeHtml(c.label)}</th>`)
      .join("")}</tr>`;
    const tableBody = sortedData
      .map(
        (row) =>
          `<tr>${columns
            .map((c) => `<td>${escapeHtml(row?.[c.key] ?? "")}</td>`)
            .join("")}</tr>`,
      )
      .join("");
    const excelHtml = `<html><head><meta charset="UTF-8" /></head><body><table>${tableHeader}${tableBody}</table></body></html>`;
    downloadFile(excelHtml, "application/vnd.ms-excel;charset=utf-8;", "xls");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: columns.length > 7 ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(17, 17, 17);
    doc.text(pdfTitle, pageWidth / 2, 42, { align: "center" });

    const tableHeaders = [columns.map((col) => col.label)];
    const tableRows = sortedData.map((row) =>
      columns.map((col) => String(row?.[col.key] ?? "")),
    );

    autoTable(doc, {
      startY: 62,
      head: tableHeaders,
      body: tableRows,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 6,
        textColor: [33, 37, 41],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [31, 58, 82],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [244, 245, 247],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      margin: { top: 62, left: 28, right: 28, bottom: 28 },
    });

    doc.save(`${pdfTitle}.pdf`);
  };

  return (
    <div className={styles.tableWrapper}>
      {displayControls && (
        <div className={styles.topControls}>
          <div className={styles.exportGroup}>
            {showEntriesDropdown && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#212529",
                }}
              >
                <span>Show</span>
                <select
                  aria-label="Entries per page"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    height: "30px",
                    padding: "2px 6px",
                    fontSize: "13px",
                    border: "1px solid #ced4da",
                    borderRadius: "3px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            )}

            {showExportButtons && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={styles.toolBtn}
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className={styles.toolBtn}
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className={styles.toolBtn}
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className={styles.toolBtn}
                >
                  PDF
                </button>
                {copyFeedback && (
                  <span className={styles.copyBadge}>{copyFeedback}</span>
                )}
              </>
            )}
          </div>

          <div className={styles.searchGroup}>
            <label htmlFor="tableSearchInput" className={styles.searchLabel}>
              Search:
            </label>
            <input
              id="tableSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>
        </div>
      )}

      <div
        className={`${styles.scrollContainer} ${
          !displayControls ? styles.emptyScrollContainer : ""
        }`}
      >
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortConfig.key === col.key;
                const sortIndicator = !isSorted
                  ? "▲▼"
                  : sortConfig.direction === "asc"
                    ? "▲"
                    : "▼";

                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`${styles.th} ${!hasData ? styles.thIdle : ""}`}
                  >
                    <div className={styles.thInner}>
                      <span>{col.label}</span>
                      {displayControls && (
                        <span
                          className={`${styles.sortIcon} ${
                            isSorted ? styles.sortActive : ""
                          }`}
                        >
                          {sortIndicator}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {displayControls && (
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr key={row?.id ?? rowIndex} className={styles.tr}>
                    {columns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        {col.render ? col.render(row) : (row?.[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length || 1}
                    className={styles.emptyCell}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {displayControls && (
        <div className={styles.bottomControls}>
          <div className={styles.infoText}>
            Showing {startEntry} to {endEntry} of {totalEntries} entries
          </div>

          <div className={styles.paginationGroup}>
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`${styles.pageBtn} ${styles.navPageBtn}`}
            >
              Previous
            </button>

            {hasData && (
              <span className={`${styles.pageBtn} ${styles.activePage}`}>
                {safeCurrentPage}
              </span>
            )}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages || !hasData}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`${styles.pageBtn} ${styles.navPageBtn}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
