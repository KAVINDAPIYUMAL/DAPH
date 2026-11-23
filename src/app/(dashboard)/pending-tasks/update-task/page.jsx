"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import ActionButton from "@/components/ActionButton";
import DataTable from "@/components/DataTable";
import styles from "./update-task.module.css";

// TODO (Backend/API): Replace test request types & task records with ASP.NET Core GET endpoints
const REQUEST_TYPE_ITEMS = [
  "Capex Budget Request",
  "Capex Budget Claim",
  "Opex Budge Claim",
  "Common Depost Claim",
  "Comercial Advanced Claim",
  "Advanced B Payment Claim",
  "Sub Imprest Request",
  "Sub Imprest Claim",
  "Temp. Employee Salary Request",
  "Department Salary Input",
  "Account Administration",
];

const TEST_TASK_RECORDS = [
  {
    id: 1,
    reference: "CAP/2023/001",
    referenceHref: "/pending-tasks/update-task?ref=CAP%2F2023%2F001",
    requestType: "Capex Budget Request",
    assignedDate: "7/13/2023 12:42:30 PM",
    assignedBy: "000000-ADMIN",
    assignedByHref: "/pending-tasks/update-task?by=000000-ADMIN",
    assignedTo: "901920664V-MR. SANDUN",
    assignedToHref: "/pending-tasks/update-task?to=901920664V-MR.%20SANDUN",
    currentStatus: "BUDGET INITIATED",
    statusHref: "/pending-tasks/update-task?status=BUDGET%20INITIATED",
  },
];

export default function UpdateTaskPage() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return REQUEST_TYPE_ITEMS;
    return REQUEST_TYPE_ITEMS.filter((item) => item.toLowerCase().includes(q));
  }, [searchText]);

  const toggleRequestType = (item) => {
    setSelectedTypes((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleSelectAll = () => {
    setSelectedTypes([...REQUEST_TYPE_ITEMS]);
  };

  const handleDeselectAll = () => {
    setSelectedTypes([]);
  };

  const handleCheckTasks = async () => {
    setHasChecked(true);

    if (selectedTypes.length === 0) {
      setTasks([]);
      return;
    }

    // Structured payload ready for ASP.NET Core Web API / PostgreSQL query
    const queryPayload = {
      requestTypes: selectedTypes,
    };

    // TODO (Backend/API): Fetch assigned tasks from ASP.NET Core / PostgreSQL using queryPayload.requestTypes
    const matched = TEST_TASK_RECORDS.filter((record) =>
      queryPayload.requestTypes.includes(record.requestType),
    );
    setTasks(matched);
  };

  const taskColumns = useMemo(
    () => [
      {
        key: "reference",
        label: "Reference",
        render: (row) => (
          <Link
            href={row.referenceHref || "/pending-tasks/update-task"}
            className={styles.rowLink}
          >
            {row.reference}
          </Link>
        ),
      },
      {
        key: "requestType",
        label: "Request type",
      },
      {
        key: "assignedDate",
        label: "Assigned date",
      },
      {
        key: "assignedBy",
        label: "Assigned By",
        render: (row) => (
          <Link
            href={row.assignedByHref || "/pending-tasks/update-task"}
            className={styles.rowLink}
          >
            {row.assignedBy}
          </Link>
        ),
      },
      {
        key: "assignedTo",
        label: "Assigned To",
        render: (row) => (
          <Link
            href={row.assignedToHref || "/pending-tasks/update-task"}
            className={styles.rowLink}
          >
            {row.assignedTo}
          </Link>
        ),
      },
      {
        key: "currentStatus",
        label: "Current status",
        render: (row) => (
          <Link
            href={row.statusHref || "/pending-tasks/update-task"}
            className={styles.rowLink}
          >
            {row.currentStatus}
          </Link>
        ),
      },
    ],
    [],
  );

  const summaryDisplay =
    selectedTypes.length > 0 ? selectedTypes.join(", ") : "Nothing Selected";

  return (
    <div className={styles.pageStack}>
      {/* Top Filter Card */}
      <div className={styles.sectionCard}>
        <div className={styles.filterBlock}>
          <label htmlFor="requestTypeTrigger" className={styles.fieldLabel}>
            Request type
          </label>

          <div className={styles.topRow}>
            <div className={styles.pickerContainer} ref={dropdownRef}>
              <button
                id="requestTypeTrigger"
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`${styles.pickerButton} ${
                  dropdownOpen ? styles.pickerButtonOpen : ""
                }`}
              >
                <span
                  className={
                    selectedTypes.length > 0
                      ? styles.selectedValueText
                      : styles.placeholderValueText
                  }
                >
                  {summaryDisplay}
                </span>
                <span className={styles.caret}>▾</span>
              </button>

              {dropdownOpen && (
                <div className={styles.pickerMenu}>
                  <div className={styles.searchInputBox}>
                    <input
                      type="text"
                      autoFocus
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className={styles.searchBox}
                      aria-label="Filter request types"
                    />
                  </div>

                  <div className={styles.bulkActionsBar}>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className={styles.bulkActionBtn}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className={styles.bulkActionBtn}
                    >
                      Deselect All
                    </button>
                  </div>

                  <ul className={styles.optionList}>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => {
                        const active = selectedTypes.includes(item);
                        return (
                          <li
                            key={item}
                            onClick={() => toggleRequestType(item)}
                            className={`${styles.optionRow} ${
                              active ? styles.optionRowActive : ""
                            }`}
                          >
                            <span>{item}</span>
                            {active && (
                              <span className={styles.checkMark}>✓</span>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className={styles.emptyOption}>No matching items</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.actionWrap}>
              <ActionButton
                type="button"
                variant="primary"
                fullWidth
                onClick={handleCheckTasks}
                className={styles.checkTasksBtn}
              >
                Check Tasks
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table Card */}
      <div className={styles.sectionCard}>
        <DataTable
          columns={taskColumns}
          data={hasChecked ? tasks : []}
          emptyMessage="No data available in table"
          pageSize={10}
          showExportButtons={false}
          showEntriesDropdown={true}
          alwaysShowControls={true}
          exportFileName="update-task-list"
          pdfTitle="Department of Animal Production & Health - Update Task"
        />
      </div>
    </div>
  );
}
