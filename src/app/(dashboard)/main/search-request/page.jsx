"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SearchableSelect from "@/components/SearchableSelect";
import ActionButton from "@/components/ActionButton";
import DataTable from "@/components/DataTable";
import styles from "./search-request.module.css";

// TODO (Backend/API): Replace test options & records with ASP.NET Core GET endpoints
const REQUEST_TYPE_OPTIONS = [
  { value: "Capex Budget Claim", label: "Capex Budget Claim" },
  { value: "Opex Budge Claim", label: "Opex Budge Claim" },
];

const STATUS_OPTIONS = [
  {
    value: "DOCUMENT COMPLETE, DOCUMENT POST, REJECTED",
    label: "DOCUMENT COMPLETE, DOCUMENT POST, REJECTED",
  },
  { value: "PENDING APPROVAL", label: "PENDING APPROVAL" },
  { value: "APPROVED", label: "APPROVED" },
  { value: "REJECTED", label: "REJECTED" },
];

const FILTER_BY_OPTIONS = [
  { value: "Budget Year", label: "Budget Year" },
  { value: "VS Office", label: "VS Office" },
  { value: "Reference", label: "Reference" },
];

const VALUE_OPTIONS_BY_FILTER = {
  "Budget Year": [
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ],
  "VS Office": [
    { value: "KAHATAGASDIGILIYA", label: "KAHATAGASDIGILIYA" },
    { value: "WELIKANDA", label: "WELIKANDA" },
    { value: "ANURADHAPURA (ENP)", label: "ANURADHAPURA (ENP)" },
  ],
  Reference: [
    { value: "CLM-2026-001", label: "CLM-2026-001" },
    { value: "CLM-2026-002", label: "CLM-2026-002" },
  ],
};

const TEST_SEARCH_RECORDS = [
  {
    id: 1,
    reference: "CLM-2026-001",
    requestType: "Opex Budge Claim",
    assignedDate: "2026/11/05",
    assignedBy: "SANDUN VIRAJ AMARASINGHE",
    assignedTo: "Finance Officer",
    currentStatus: "DOCUMENT COMPLETE",
    budgetYear: "2026",
    vsOffice: "KAHATAGASDIGILIYA",
  },
  {
    id: 2,
    reference: "CLM-2026-002",
    requestType: "Capex Budget Claim",
    assignedDate: "2026/11/12",
    assignedBy: "SANDUN VIRAJ AMARASINGHE",
    assignedTo: "Planning Unit",
    currentStatus: "PENDING APPROVAL",
    budgetYear: "2026",
    vsOffice: "WELIKANDA",
  },
];

const SEARCH_COLUMNS = [
  { key: "reference", label: "Reference" },
  { key: "requestType", label: "Request type" },
  { key: "assignedDate", label: "Assigned date" },
  { key: "assignedBy", label: "Assigned By" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "currentStatus", label: "Current status" },
];

export default function SearchRequestPage() {
  const [startDate, setStartDate] = useState("2026/11/01");
  const [endDate, setEndDate] = useState("2026/11/23");
  const [requestType, setRequestType] = useState("");
  const [status, setStatus] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [results, setResults] = useState([]);

  const valueOptions = useMemo(() => {
    if (!filterBy) return [];
    return VALUE_OPTIONS_BY_FILTER[filterBy] || [];
  }, [filterBy]);

  const handleFilterByChange = (nextFilter) => {
    setFilterBy(nextFilter);
    setFilterValue("");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const searchCriteria = {
      startDate,
      endDate,
      requestType: requestType || null,
      status: status || null,
      filterBy: filterBy || null,
      filterValue: filterValue || null,
    };

    // TODO (Backend/API): Fetch matching records from ASP.NET Core / PostgreSQL
    const matches = TEST_SEARCH_RECORDS.filter((row) => {
      if (
        searchCriteria.requestType &&
        row.requestType !== searchCriteria.requestType
      ) {
        return false;
      }
      if (
        searchCriteria.filterBy === "Budget Year" &&
        searchCriteria.filterValue &&
        row.budgetYear !== searchCriteria.filterValue
      ) {
        return false;
      }
      if (
        searchCriteria.filterBy === "VS Office" &&
        searchCriteria.filterValue &&
        row.vsOffice !== searchCriteria.filterValue
      ) {
        return false;
      }
      return true;
    });

    setResults(matches);
  };

  return (
    <div className={styles.pageStack}>
      {/* Top Filter Card */}
      <div className={styles.sectionCard}>
        <PageHeader title="Search Request" />

        <form onSubmit={handleSearchSubmit} className={styles.formBody}>
          <div className={styles.fourColRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="searchStartDate" className={styles.label}>
                Start Date
              </label>
              <input
                id="searchStartDate"
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${styles.input} ${styles.grayInput}`}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="searchEndDate" className={styles.label}>
                End Date
              </label>
              <input
                id="searchEndDate"
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`${styles.input} ${styles.grayInput}`}
              />
            </div>

            <div className={styles.graySelectWrap}>
              <SearchableSelect
                id="searchRequestTypes"
                label="Request Types"
                options={REQUEST_TYPE_OPTIONS}
                value={requestType}
                onChange={setRequestType}
                placeholder="Nothing Selected"
              />
            </div>

            <div className={styles.graySelectWrap}>
              <SearchableSelect
                id="searchStatus"
                label="Status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
                placeholder="Nothing Selected"
              />
            </div>
          </div>

          <div className={styles.filterActionRow}>
            <div className={styles.graySelectWrap}>
              <SearchableSelect
                id="searchFilterBy"
                label="Filter by"
                options={FILTER_BY_OPTIONS}
                value={filterBy}
                onChange={handleFilterByChange}
                placeholder="Nothing Selected"
              />
            </div>

            <div className={styles.graySelectWrap}>
              <SearchableSelect
                id="searchFilterValue"
                label="Value"
                options={valueOptions}
                value={filterValue}
                onChange={setFilterValue}
                placeholder="Nothing Selected"
                disabled={!filterBy}
              />
            </div>

            <div className={styles.submitAlign}>
              <ActionButton
                type="submit"
                variant="green"
                fullWidth
                className={styles.submitBtn}
              >
                Submit
              </ActionButton>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Results Card (Single DataTable instance) */}
      <div className={styles.sectionCard}>
        <DataTable
          columns={SEARCH_COLUMNS}
          data={results}
          emptyMessage="No data available in table"
          pageSize={10}
          showExportButtons={false}
          showEntriesDropdown={true}
          alwaysShowControls={true}
          exportFileName="search-request-results"
          pdfTitle="Department of Animal Production & Health - Search Request"
        />
      </div>
    </div>
  );
}
