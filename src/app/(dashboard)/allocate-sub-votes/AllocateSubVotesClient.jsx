"use client";

import { useState, useMemo, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./allocate-sub-votes.module.css";
import { addSubVoteAction, deleteSubVoteAction } from "./actions";

const REQUEST_REFERENCES = [
  { id: "", label: "Nothing Selected" },
  { id: "REQ-2026-001", label: "REQ-2026-001 | Livestock Development Grant" },
  { id: "REQ-2026-002", label: "REQ-2026-002 | Veterinary Medical Supplies" },
  { id: "REQ-2026-003", label: "REQ-2026-003 | Pasture & Fodder Cultivation" },
  { id: "REQ-2026-004", label: "REQ-2026-004 | Artificial Insemination Network" },
  { id: "REQ-2026-005", label: "REQ-2026-005 | Disease Surveillance & Vaccines" },
];

const ACCOUNT_TYPES = [
  "Recurrent Expenditure",
  "Capital Expenditure",
  "Advance Account",
  "Special Development Project",
];

const ACCOUNT_CATEGORIES = [
  "Personal Emoluments",
  "Traveling Expenses",
  "Supplies & Consumables",
  "Maintenance & Repairs",
  "Contractual Services",
  "Transfers & Subsidies",
  "Rehabilitation & Improvement of Capital Assets",
  "Acquisition of Capital Assets",
  "Capacity Building",
];

export default function AllocateSubVotesClient({ initialVotes = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedRef, setSelectedRef] = useState("");
  const [isRefDropdownOpen, setIsRefDropdownOpen] = useState(false);
  const [refSearchText, setRefSearchText] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Table items state (starts empty to match screenshot)
  const [votes, setVotes] = useState(initialVotes);

  // Search & Pagination & Sorting (default sorted on Account Type asc matching Image)
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("accountType");
  const [sortAsc, setSortAsc] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequiredAlertOpen, setIsRequiredAlertOpen] = useState(false);
  const [isRefDetailsModalOpen, setIsRefDetailsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    accountType: "Recurrent Expenditure",
    accountCategory: "Personal Emoluments",
    vote: "",
    amount: "",
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRefDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when dropdown opens
  useEffect(() => {
    if (isRefDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setRefSearchText("");
    }
  }, [isRefDropdownOpen]);

  // Search filtered references
  const filteredReferences = useMemo(() => {
    if (!refSearchText.trim()) {
      return REQUEST_REFERENCES;
    }
    const query = refSearchText.toLowerCase();
    return REQUEST_REFERENCES.filter(
      (item) => item.id && item.label.toLowerCase().includes(query)
    );
  }, [refSearchText]);

  // Filter & Sort
  const filteredVotes = useMemo(() => {
    let result = [...votes];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.accountType?.toLowerCase().includes(term) ||
          v.accountCategory?.toLowerCase().includes(term) ||
          v.vote?.toLowerCase().includes(term) ||
          v.amount?.toString().includes(term)
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === "amount") {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
          return sortAsc ? valA - valB : valB - valA;
        }

        const comp = String(valA || "").localeCompare(String(valB || ""));
        return sortAsc ? comp : -comp;
      });
    }

    return result;
  }, [votes, searchTerm, sortField, sortAsc]);

  // Pagination calculation
  const totalEntries = filteredVotes.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalEntries);

  const displayedVotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVotes.slice(start, start + pageSize);
  }, [filteredVotes, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Open Add Modal or Trigger Required Alert if nothing selected
  const handleAddClick = () => {
    if (!selectedRef) {
      setIsRequiredAlertOpen(true);
      return;
    }
    openAddModal();
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      accountType: "Recurrent Expenditure",
      accountCategory: "Personal Emoluments",
      vote: "",
      amount: "",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      accountType: item.accountType,
      accountCategory: item.accountCategory,
      vote: item.vote,
      amount: item.amount,
    });
    setIsModalOpen(true);
  };

  // Delete Vote using Next.js Server Action
  const handleDeleteVote = (id) => {
    if (window.confirm("Are you sure you want to remove this vote allocation?")) {
      startTransition(async () => {
        setVotes((prev) => prev.filter((v) => v.id !== id));
        await deleteSubVoteAction(id);
        showToast("Vote allocation removed successfully.");
        router.refresh();
      });
    }
  };

  // Submit Modal Form using Next.js Server Action
  const handleSaveVote = (e) => {
    e.preventDefault();
    if (!formData.vote.trim()) {
      alert("Please enter a valid Vote code.");
      return;
    }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid positive Amount.");
      return;
    }

    startTransition(async () => {
      if (editingId) {
        setVotes((prev) =>
          prev.map((v) =>
            v.id === editingId
              ? {
                  ...v,
                  accountType: formData.accountType,
                  accountCategory: formData.accountCategory,
                  vote: formData.vote.trim(),
                  amount: parseFloat(formData.amount),
                }
              : v
          )
        );
        showToast("Vote allocation updated successfully.");
      } else {
        const payload = {
          accountType: formData.accountType,
          accountCategory: formData.accountCategory,
          vote: formData.vote.trim(),
          amount: parseFloat(formData.amount),
          reference: selectedRef || "REQ-2026-001",
        };
        const res = await addSubVoteAction(payload);
        if (res?.success) {
          setVotes((prev) => [...prev, res.data]);
        }
        showToast("New vote allocation added successfully.");
      }
      setIsModalOpen(false);
      router.refresh();
    });
  };

  const selectedRefObj = REQUEST_REFERENCES.find((r) => r.id === selectedRef);
  const selectedLabel = selectedRefObj ? selectedRefObj.label : "Nothing Selected";

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Card: Allocate Sub Votes & Request Reference (Exact 854px) */}
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>Allocate Sub Votes</h1>

        <div className={styles.formRow}>
          {/* Request Reference Selector */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Request Reference</label>
            <div className={styles.selectWrapper} ref={dropdownRef}>
              <button
                type="button"
                className={`${styles.selectButton} ${selectedRef ? styles.hasValue : ""}`}
                onClick={() => setIsRefDropdownOpen(!isRefDropdownOpen)}
              >
                <span>{selectedLabel}</span>
                <i className={`fa-solid fa-caret-down ${styles.caretIcon}`}></i>
              </button>

              {isRefDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.searchBoxWrapper}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={styles.dropdownSearchInput}
                      value={refSearchText}
                      onChange={(e) => setRefSearchText(e.target.value)}
                    />
                  </div>

                  <div className={styles.optionsList}>
                    {filteredReferences.length === 0 ? (
                      <div className={styles.noResults}>
                        No results matched &quot;{refSearchText}&quot;
                      </div>
                    ) : (
                      filteredReferences.map((item) => (
                        <div
                          key={item.id}
                          className={`${styles.dropdownOption} ${
                            selectedRef === item.id ? styles.active : ""
                          }`}
                          onClick={() => {
                            setSelectedRef(item.id);
                            setIsRefDropdownOpen(false);
                            setRefSearchText("");
                          }}
                        >
                          {item.label}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Grid icon button below Request Reference (Exact pixel-mapped SVG) */}
            <div
              className={styles.gridIconBtn}
              title="View Request Reference Details"
              onClick={() => setIsRefDetailsModalOpen(true)}
            >
              <svg
                width="19"
                height="17"
                viewBox="0 0 19 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.tableIconSvg}
              >
                <rect width="19" height="17" rx="1" fill="#7F7FFF" />
                <rect x="2" y="5" width="6" height="4" fill="#FFFFFF" />
                <rect x="11" y="5" width="6" height="4" fill="#FFFFFF" />
                <rect x="2" y="11" width="6" height="4" fill="#FFFFFF" />
                <rect x="11" y="11" width="6" height="4" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* Add New Vote Action Button */}
          <button type="button" className={styles.addBtn} onClick={handleAddClick}>
            <i className="fa-solid fa-plus"></i> Add New Vote
          </button>
        </div>
      </div>

      {/* Bottom Card: Data Table (Exact 854px) */}
      <div className={styles.tableCard}>
        {/* Controls: Show Entries & Search */}
        <div className={styles.tableControls}>
          <div className={styles.entriesControl}>
            <span>Show</span>
            <select
              className={styles.entriesSelect}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className={styles.searchControl}>
            <label htmlFor="tableSearch">Search:</label>
            <input
              id="tableSearch"
              type="text"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "26%" }} onClick={() => handleSort("accountType")}>
                  <div className={styles.thContent}>
                    <span>Account Type</span>
                    {sortField === "accountType" ? (
                      <span className={styles.sortIconActive}>{sortAsc ? "▲" : "▼"}</span>
                    ) : (
                      <span className={styles.sortIconNeutral}>⇅</span>
                    )}
                  </div>
                </th>
                <th style={{ width: "33%" }} onClick={() => handleSort("accountCategory")}>
                  <div className={styles.thContent}>
                    <span>Account Category</span>
                    {sortField === "accountCategory" ? (
                      <span className={styles.sortIconActive}>{sortAsc ? "▲" : "▼"}</span>
                    ) : (
                      <span className={styles.sortIconNeutral}>⇅</span>
                    )}
                  </div>
                </th>
                <th style={{ width: "14%" }} onClick={() => handleSort("vote")}>
                  <div className={styles.thContent}>
                    <span>Vote</span>
                    {sortField === "vote" ? (
                      <span className={styles.sortIconActive}>{sortAsc ? "▲" : "▼"}</span>
                    ) : (
                      <span className={styles.sortIconNeutral}>⇅</span>
                    )}
                  </div>
                </th>
                <th style={{ width: "19%" }} onClick={() => handleSort("amount")}>
                  <div className={styles.thContent}>
                    <span>Amount</span>
                    {sortField === "amount" ? (
                      <span className={styles.sortIconActive}>{sortAsc ? "▲" : "▼"}</span>
                    ) : (
                      <span className={styles.sortIconNeutral}>⇅</span>
                    )}
                  </div>
                </th>
                <th style={{ width: "8%", textAlign: "center" }}>
                  <span className={styles.sortIconNeutral}>⇅</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedVotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noDataRow}>
                    No data available in table
                  </td>
                </tr>
              ) : (
                displayedVotes.map((row) => (
                  <tr key={row.id}>
                    <td>{row.accountType}</td>
                    <td>{row.accountCategory}</td>
                    <td>{row.vote}</td>
                    <td className={styles.amountCell}>
                      {Number(row.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        title="Edit"
                        onClick={() => openEditModal(row)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete"
                        onClick={() => handleDeleteVote(row.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Info & Previous/Next */}
        <div className={styles.tableFooter}>
          <div className={styles.tableInfo}>
            Showing {startIndex} to {endIndex} of {totalEntries} entries
          </div>

          <div className={styles.pagination}>
            <button
              type="button"
              className={`${styles.pageLink} ${currentPage === 1 ? styles.disabled : ""}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              type="button"
              className={`${styles.pageLink} ${
                currentPage >= totalPages || totalEntries === 0 ? styles.disabled : ""
              }`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages || totalEntries === 0}
            >
              Next
            </button>
          </div>
        </div>

        {/* Scroll Track Bar Matching Exact Screenshot */}
        <div className={styles.scrollTrackContainer}>
          <span className={styles.scrollArrow}>&#9668;</span>
          <div className={styles.scrollTrack}></div>
          <span className={styles.scrollArrow}>&#9658;</span>
        </div>
      </div>

      {/* Required Reference Alert Modal (Exact #660000, 335px x 216px from screenshot) */}
      {isRequiredAlertOpen && (
        <div
          className={styles.alertOverlay}
          onClick={() => setIsRequiredAlertOpen(false)}
        >
          <div
            className={styles.alertBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.alertIconCircle}>
              <span className={styles.alertIconX}>&#10005;</span>
            </div>
            <h2 className={styles.alertTitle}>Required.</h2>
            <p className={styles.alertMessage}>Please Select Request Reference</p>
            <button
              type="button"
              className={styles.alertOkBtn}
              onClick={() => setIsRequiredAlertOpen(false)}
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Vote Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingId ? "Edit Vote Allocation" : "Add New Vote Allocation"}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveVote}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Account Type</label>
                  <select
                    className={styles.formSelect}
                    value={formData.accountType}
                    onChange={(e) =>
                      setFormData({ ...formData, accountType: e.target.value })
                    }
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Account Category</label>
                  <select
                    className={styles.formSelect}
                    value={formData.accountCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, accountCategory: e.target.value })
                    }
                  >
                    {ACCOUNT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Vote Code</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. 285-01-01-1001"
                    value={formData.vote}
                    onChange={(e) => setFormData({ ...formData, vote: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Amount (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    placeholder="e.g. 150000.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={isPending}>
                  {editingId ? "Update Vote" : "+ Save Vote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Reference Details Modal (triggered by grid icon) */}
      {isRefDetailsModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsRefDetailsModalOpen(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Request Reference Overview</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsRefDetailsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#333" }}>
                <p>
                  <strong>Current Reference:</strong>{" "}
                  {selectedLabel !== "Nothing Selected"
                    ? selectedLabel
                    : "No reference selected"}
                </p>
                <p>
                  <strong>Department:</strong> Department of Animal Production & Health (DAPH)
                </p>
                <p>
                  <strong>Total Sub-Votes Configured:</strong> {votes.length}
                </p>
                <p>
                  <strong>Total Allocated Sum:</strong> LKR{" "}
                  {votes
                    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={() => setIsRefDetailsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
