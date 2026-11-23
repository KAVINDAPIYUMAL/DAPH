"use client";

import { useState, useRef, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import SearchableSelect from "@/components/SearchableSelect";
import ActionButton from "@/components/ActionButton";
import styles from "./create-request-claim.module.css";

// TODO (Backend/API): Replace test defaults & option arrays with ASP.NET Core GET endpoints
const TEST_REQUESTER_DEFAULTS = {
  requesterNic: "901920664V",
  requesterName: "SANDUN VIRAJ AMARASINGHE",
  defaultBudgetYear: "2026",
  opexBudgetYear: "2020",
  defaultFarmReference: "72102146-L.D.M. Chandralatha",
};

const REQUEST_TYPE_OPTIONS = [
  { value: "Capex Budget Claim", label: "Capex Budget Claim" },
  { value: "Opex Budge Claim", label: "Opex Budge Claim" },
];

const BOARD_ACTIVITY_OPTIONS = [
  { value: "BA-01", label: "Livestock Infrastructure Development" },
  { value: "BA-02", label: "Veterinary Laboratory Equipment" },
  { value: "BA-03", label: "Regional Breeding Station Upgrade" },
];

const OBJECT_CATEGORY_OPTIONS = [
  { value: "Interest Payments", label: "Interest Payments" },
  { value: "Supplies & Requisites", label: "Supplies & Requisites" },
  { value: "Transport & Travel", label: "Transport & Travel" },
];

const OBJECT_OPTIONS_BY_CATEGORY = {
  "Interest Payments": [
    {
      value: "Interest Payment for Foreign Debt",
      label: "Interest Payment for Foreign Debt",
    },
    {
      value: "Interest Payment for Domestic Debt",
      label: "Interest Payment for Domestic Debt",
    },
  ],
  "Supplies & Requisites": [
    { value: "Vaccines & Medicines", label: "Vaccines & Medicines" },
    { value: "Laboratory Chemicals", label: "Laboratory Chemicals" },
  ],
  "Transport & Travel": [
    {
      value: "Field Visit Fuel Allowance",
      label: "Field Visit Fuel Allowance",
    },
    {
      value: "Official Vehicle Maintenance",
      label: "Official Vehicle Maintenance",
    },
  ],
};

const FARM_REFERENCE_OPTIONS = [
  {
    value: "72102146-L.D.M. Chandralatha",
    label: "72102146-L.D.M. Chandralatha",
  },
  {
    value: "71330001-Mr Thilak",
    label: "71330001-Mr Thilak",
  },
  {
    value: "60120445-Nuwara Dairy Farm",
    label: "60120445-Nuwara Dairy Farm",
  },
];

// Decade grid matching « 2020-2029 » with muted boundary years 2019 & 2030
const DECADE_START = 2020;
const DECADE_YEARS = [
  { year: "2019", muted: true },
  { year: "2020", muted: false },
  { year: "2021", muted: false },
  { year: "2022", muted: false },
  { year: "2023", muted: false },
  { year: "2024", muted: false },
  { year: "2025", muted: false },
  { year: "2026", muted: false },
  { year: "2027", muted: false },
  { year: "2028", muted: false },
  { year: "2029", muted: false },
  { year: "2030", muted: true },
];

function buildDecadeGrid(startYear) {
  const items = [];
  for (let offset = -1; offset <= 10; offset += 1) {
    const yr = startYear + offset;
    items.push({
      year: String(yr),
      muted: offset === -1 || offset === 10,
    });
  }
  return items;
}

export default function CreateRequestClaimPage() {
  const [requesterNic, setRequesterNic] = useState(
    TEST_REQUESTER_DEFAULTS.requesterNic,
  );
  const [requesterName, setRequesterName] = useState(
    TEST_REQUESTER_DEFAULTS.requesterName,
  );
  const [requestType, setRequestType] = useState("");
  const [budgetYear, setBudgetYear] = useState(
    TEST_REQUESTER_DEFAULTS.defaultBudgetYear,
  );

  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(DECADE_START);
  const yearPickerRef = useRef(null);

  const [boardActivity, setBoardActivity] = useState("");
  const [objectCategory, setObjectCategory] = useState("Interest Payments");
  const [objectItem, setObjectItem] = useState(
    "Interest Payment for Foreign Debt",
  );

  const [isFarmRelated, setIsFarmRelated] = useState(false);
  const [farmReference, setFarmReference] = useState(
    TEST_REQUESTER_DEFAULTS.defaultFarmReference,
  );

  const [description, setDescription] = useState("");
  const [requestAmount, setRequestAmount] = useState("0");
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        yearPickerRef.current &&
        !yearPickerRef.current.contains(event.target)
      ) {
        setYearPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isCapex = requestType === "Capex Budget Claim";
  const isOpex = requestType === "Opex Budge Claim";

  const availableObjects =
    OBJECT_OPTIONS_BY_CATEGORY[objectCategory] ||
    OBJECT_OPTIONS_BY_CATEGORY["Interest Payments"];

  const visibleYears =
    decadeStart === DECADE_START ? DECADE_YEARS : buildDecadeGrid(decadeStart);

  const handleRequestTypeChange = (nextType) => {
    setRequestType(nextType);
    setFeedback("");

    if (nextType === "Capex Budget Claim") {
      setBudgetYear(TEST_REQUESTER_DEFAULTS.defaultBudgetYear);
      setDecadeStart(DECADE_START);
      setBoardActivity("");
    } else if (nextType === "Opex Budge Claim") {
      setBudgetYear(TEST_REQUESTER_DEFAULTS.opexBudgetYear);
      setDecadeStart(DECADE_START);
      setObjectCategory("Interest Payments");
      setObjectItem("Interest Payment for Foreign Debt");
    } else {
      setBudgetYear(TEST_REQUESTER_DEFAULTS.defaultBudgetYear);
      setDecadeStart(DECADE_START);
    }
  };

  const handleSelectBudgetYear = (yearStr) => {
    setBudgetYear(yearStr);
    setYearPickerOpen(false);
  };

  const handleObjectCategoryChange = (nextCategory) => {
    setObjectCategory(nextCategory);
    const firstObject =
      OBJECT_OPTIONS_BY_CATEGORY[nextCategory]?.[0]?.value || "";
    setObjectItem(firstObject);
  };

  const handleFarmCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsFarmRelated(checked);
    if (checked && !farmReference) {
      setFarmReference(TEST_REQUESTER_DEFAULTS.defaultFarmReference);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestType) {
      setFeedback("Please select a Request Type.");
      return;
    }

    // Structured payload ready for ASP.NET Core Web API / PostgreSQL integration
    const claimPayload = {
      requesterNic: requesterNic.trim(),
      requesterName: requesterName.trim(),
      requestType,
      budgetYear,
      boardActivity: isCapex ? boardActivity : null,
      objectCategory: isOpex ? objectCategory : null,
      objectItem: isOpex ? objectItem : null,
      isFarmRelated,
      farmReference: isFarmRelated ? farmReference : null,
      description: description.trim(),
      requestAmount: Number(requestAmount) || 0,
      documentName: selectedFile ? selectedFile.name : null,
    };

    // TODO (Backend/API): POST claimPayload (or FormData with selectedFile) to ASP.NET Core endpoint
    setFeedback(
      `Prepared claim (${claimPayload.requestType}, Budget Year: ${claimPayload.budgetYear}, Amount: ${claimPayload.requestAmount}).`,
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formCard}>
        <PageHeader title="Create Request Claim" />

        <form onSubmit={handleSubmit} className={styles.formBody}>
          {/* Row 1: Requester NIC & Requester Name */}
          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="requesterNic" className={styles.label}>
                Requester NIC
              </label>
              <input
                id="requesterNic"
                type="text"
                value={requesterNic}
                onChange={(e) => setRequesterNic(e.target.value)}
                placeholder="Requester NIC"
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="requesterName" className={styles.label}>
                Requester Name
              </label>
              <input
                id="requesterName"
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Requester Name"
                className={styles.input}
              />
            </div>
          </div>

          {/* Row 2: Request Types & Budget Year Picker */}
          <div className={styles.twoColRow}>
            <div className={styles.graySelectOverride}>
              <SearchableSelect
                id="requestTypes"
                label="Request Types"
                options={REQUEST_TYPE_OPTIONS}
                value={requestType}
                onChange={handleRequestTypeChange}
                placeholder="Nothing Selected"
              />
            </div>

            <div className={styles.fieldGroup} ref={yearPickerRef}>
              <label htmlFor="budgetYear" className={styles.label}>
                Budget Year
              </label>
              <div className={styles.yearPickerContainer}>
                <input
                  id="budgetYear"
                  type="text"
                  readOnly
                  value={budgetYear}
                  onClick={() => setYearPickerOpen((prev) => !prev)}
                  className={`${styles.input} ${styles.yearInput} ${
                    yearPickerOpen ? styles.yearInputActive : ""
                  }`}
                />

                {yearPickerOpen && (
                  <div className={styles.yearPopup}>
                    <div className={styles.yearPopupHeader}>
                      <button
                        type="button"
                        onClick={() => setDecadeStart((d) => d - 10)}
                        className={styles.yearNavBtn}
                        aria-label="Previous decade"
                      >
                        &laquo;
                      </button>
                      <span className={styles.decadeLabel}>
                        {decadeStart}-{decadeStart + 9}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDecadeStart((d) => d + 10)}
                        className={styles.yearNavBtn}
                        aria-label="Next decade"
                      >
                        &raquo;
                      </button>
                    </div>

                    <div className={styles.yearGrid}>
                      {visibleYears.map((item) => {
                        const isSelected = item.year === budgetYear;
                        return (
                          <button
                            key={item.year}
                            type="button"
                            onClick={() => handleSelectBudgetYear(item.year)}
                            className={`${styles.yearCell} ${
                              item.muted ? styles.yearMuted : ""
                            } ${isSelected ? styles.yearSelected : ""}`}
                          >
                            {item.year}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Capex: Board Activity */}
          {isCapex && (
            <div
              className={`${styles.fullWidthField} ${styles.graySelectOverride}`}
            >
              <SearchableSelect
                id="boardActivity"
                label="Board Activity"
                options={BOARD_ACTIVITY_OPTIONS}
                value={boardActivity}
                onChange={setBoardActivity}
                placeholder="Nothing Selected"
              />
            </div>
          )}

          {/* Opex: Object Category & Object */}
          {isOpex && (
            <>
              <div
                className={`${styles.fullWidthField} ${styles.graySelectOverride}`}
              >
                <SearchableSelect
                  id="objectCategory"
                  label="Object Category"
                  options={OBJECT_CATEGORY_OPTIONS}
                  value={objectCategory}
                  onChange={handleObjectCategoryChange}
                  placeholder="Nothing Selected"
                />
              </div>

              <div
                className={`${styles.fullWidthField} ${styles.graySelectOverride}`}
              >
                <SearchableSelect
                  id="objectSelect"
                  label="Object"
                  options={availableObjects}
                  value={objectItem}
                  onChange={setObjectItem}
                  placeholder="Nothing Selected"
                />
              </div>
            </>
          )}

          {/* Row: Farm Related Claim & Conditional Farm Reference */}
          <div className={styles.twoColRow}>
            <div className={styles.checkboxRow}>
              <input
                id="farmRelatedClaim"
                type="checkbox"
                checked={isFarmRelated}
                onChange={handleFarmCheckboxChange}
                className={styles.checkboxInput}
              />
              <label
                htmlFor="farmRelatedClaim"
                className={styles.checkboxLabel}
              >
                Farm Related Claim
              </label>
            </div>

            {isFarmRelated && (
              <div className={styles.fieldGroup}>
                <label htmlFor="farmReference" className={styles.label}>
                  Farm Reference
                </label>
                <select
                  id="farmReference"
                  value={farmReference}
                  onChange={(e) => setFarmReference(e.target.value)}
                  className={styles.farmSelect}
                >
                  {FARM_REFERENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row: Description & Request Amount */}
          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="claimDescription" className={styles.label}>
                Description
              </label>
              <textarea
                id="claimDescription"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="requestAmount" className={styles.label}>
                Request Amount
              </label>
              <input
                id="requestAmount"
                type="number"
                step="any"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Row: Add Scanned documents & Submit Button */}
          <div className={styles.bottomActionRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="scannedDocuments" className={styles.label}>
                Add Scanned documents
              </label>
              <input
                id="scannedDocuments"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className={styles.nativeFileInput}
              />
            </div>

            <div className={styles.submitCol}>
              <ActionButton
                type="submit"
                variant="teal"
                className={styles.submitBtn}
              >
                Submit
              </ActionButton>
            </div>
          </div>

          {feedback && <p className={styles.feedbackText}>{feedback}</p>}
        </form>
      </div>
    </div>
  );
}
