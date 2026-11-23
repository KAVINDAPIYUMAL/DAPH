"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchableSelect from "@/components/SearchableSelect";
import ActionButton from "@/components/ActionButton";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import styles from "./daily-diary.module.css";

const VS_OFFICES = [
  "ANURADHAPURA (CNP)",
  "ANURADHAPURA (ENP)",
  "GALENBINDUNUWEWA",
  "GALNEWA",
  "HOROWPOTHANA",
  "IPALOHAMA",
  "KAHATAGASDIGILIYA",
  "KEBITHIGOLLAWA",
  "KEKIRAWA",
  "MEDAWACHCHIYA",
  "MIHINTALE",
  "NACHCHADUWA",
  "NOCHCHIYAGAMA",
  "PADAVIYA",
  "PALAGALA",
  "PALUGASWEWA",
  "RAJANGANAYA",
  "RAMBEWA",
  "THAMBUTHTHEGAMA",
  "WELIKANDA",
];

const FARM_OPTIONS = [
  { value: "", label: "choose one of the following", ref: "", name: "" },
  {
    value: "71330001",
    label: "71330001 - Mr Thilak",
    ref: "71330001",
    name: "Mr Thilak",
  },
  {
    value: "60120445",
    label: "60120445 - Nuwara Dairy Farm",
    ref: "60120445",
    name: "Nuwara Dairy Farm",
  },
  {
    value: "88210932",
    label: "88210932 - Kalawewa Livestock Unit",
    ref: "88210932",
    name: "Kalawewa Livestock Unit",
  },
];

const INITIAL_DIARY_RECORDS = [
  {
    id: 1,
    vsOffice: "KAHATAGASDIGILIYA",
    date: "2022/09/23",
    inTime: "",
    outTime: "",
    returnTime: "",
    farmReference: "71330001",
    farmName: "Mr Thilak",
    tasks: "Test",
    placesVisited: "",
    vehicleNo: "",
    distance: "",
  },
  {
    id: 2,
    vsOffice: "KAHATAGASDIGILIYA",
    date: "2022/09/23",
    inTime: "",
    outTime: "",
    returnTime: "",
    farmReference: "",
    farmName: "",
    tasks: "test1",
    placesVisited: "",
    vehicleNo: "",
    distance: "",
  },
  {
    id: 3,
    vsOffice: "WELIKANDA",
    date: "2022/09/23",
    inTime: "",
    outTime: "",
    returnTime: "",
    farmReference: "71330001",
    farmName: "Mr Thilak",
    tasks: "Test",
    placesVisited: "",
    vehicleNo: "",
    distance: "",
  },
  {
    id: 4,
    vsOffice: "WELIKANDA",
    date: "2022/09/23",
    inTime: "",
    outTime: "",
    returnTime: "",
    farmReference: "",
    farmName: "",
    tasks: "test1",
    placesVisited: "",
    vehicleNo: "",
    distance: "",
  },
];

const DIARY_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "inTime", label: "In time" },
  { key: "outTime", label: "Out time" },
  { key: "returnTime", label: "Return time" },
  { key: "farmReference", label: "Farm Reference" },
  { key: "farmName", label: "Farm Name" },
  { key: "tasks", label: "Tasks" },
  { key: "placesVisited", label: "Places Visited" },
  { key: "vehicleNo", label: "Vehicle No" },
  { key: "distance", label: "Distance" },
];

function getTodayFormatted() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function createEmptyTaskForm(defaultDate) {
  return {
    date: defaultDate,
    inTime: "",
    outTime: "",
    returnTime: "",
    placesVisited: "",
    vehicleNo: "",
    distance: "",
    farmSelected: "",
    tasks: "",
    farmerTrainingsHrs: "",
    onFarmFollowUpHrs: "",
    dataCollectionHrs: "",
    pigsHrs: "",
    chickensHrs: "",
    goatsHrs: "",
    meetingsHrs: "",
    societiesTimeHrs: "",
    vaccinationHrs: "",
    mobileServiceHrs: "",
    otherHrs: "",
  };
}

function createInitialExpandedSections() {
  return {
    dairy: false,
    livestock: false,
    societies: false,
  };
}

export default function DailyDiaryPage() {
  const todayDate = getTodayFormatted();

  const [selectedOffice, setSelectedOffice] = useState("");
  const [records, setRecords] = useState(INITIAL_DIARY_RECORDS);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formFeedback, setFormFeedback] = useState("");
  const [modalError, setModalError] = useState("");
  const [expandedSections, setExpandedSections] = useState(
    createInitialExpandedSections,
  );
  const [newTask, setNewTask] = useState(() => createEmptyTaskForm(todayDate));

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleOfficeChange = (officeValue) => {
    setSelectedOffice(officeValue);
    setFormFeedback("");
  };

  const handleViewDiary = () => {
    if (!selectedOffice) {
      setFormFeedback("Please select a VS Office first.");
      setVisibleRows([]);
      return;
    }

    setFormFeedback("");
    const matching = records.filter((item) => item.vsOffice === selectedOffice);
    setVisibleRows(matching.length > 0 ? matching : records.slice(0, 2));
  };

  const handleOpenAddTask = () => {
    if (!selectedOffice) {
      setFormFeedback("Please select a VS Office before adding a task.");
      return;
    }
    setFormFeedback("");
    setModalError("");
    setExpandedSections(createInitialExpandedSections());
    setNewTask(createEmptyTaskForm(todayDate));
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setModalError("");
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!newTask.tasks.trim()) {
      setModalError("Please enter task details in Tasks.");
      return;
    }

    const matchedFarm = FARM_OPTIONS.find(
      (f) => f.value === newTask.farmSelected,
    );

    const nextId =
      records.length > 0
        ? Math.max(...records.map((r) => Number(r.id) || 0)) + 1
        : 1;

    const createdEntry = {
      id: nextId,
      vsOffice: selectedOffice,
      date: newTask.date || todayDate,
      inTime: newTask.inTime,
      outTime: newTask.outTime,
      returnTime: newTask.returnTime,
      farmReference: matchedFarm ? matchedFarm.ref : "",
      farmName: matchedFarm ? matchedFarm.name : "",
      tasks: newTask.tasks.trim(),
      placesVisited: newTask.placesVisited.trim(),
      vehicleNo: newTask.vehicleNo.trim(),
      distance: newTask.distance.trim(),
      farmerTrainingsHrs: newTask.farmerTrainingsHrs.trim(),
      onFarmFollowUpHrs: newTask.onFarmFollowUpHrs.trim(),
      dataCollectionHrs: newTask.dataCollectionHrs.trim(),
      pigsHrs: newTask.pigsHrs.trim(),
      chickensHrs: newTask.chickensHrs.trim(),
      goatsHrs: newTask.goatsHrs.trim(),
      meetingsHrs: newTask.meetingsHrs.trim(),
      societiesTimeHrs: newTask.societiesTimeHrs.trim(),
      vaccinationHrs: newTask.vaccinationHrs.trim(),
      mobileServiceHrs: newTask.mobileServiceHrs.trim(),
      otherHrs: newTask.otherHrs.trim(),
    };

    setRecords((prev) => [...prev, createdEntry]);
    setVisibleRows((prev) => [...prev, createdEntry]);
    setNewTask(createEmptyTaskForm(todayDate));
    setExpandedSections(createInitialExpandedSections());
    setModalError("");
    setIsAddModalOpen(false);
  };

  return (
    <div className={styles.pageStack}>
      <div className={styles.topCard}>
        <PageHeader title="Daily Diary Details" />

        <div className={styles.controlsRow}>
          <SearchableSelect
            id="vsOfficeSelect"
            label="VS Office"
            options={VS_OFFICES}
            value={selectedOffice}
            onChange={handleOfficeChange}
            placeholder="choose one of the following"
          />

          <div className={styles.buttonAlignBottom}>
            <ActionButton variant="teal" fullWidth onClick={handleViewDiary}>
              View Diary
            </ActionButton>
          </div>

          <div className={styles.buttonAlignBottom}>
            <ActionButton variant="green" fullWidth onClick={handleOpenAddTask}>
              Add Task
            </ActionButton>
          </div>
        </div>

        {formFeedback && <p className={styles.feedbackText}>{formFeedback}</p>}
      </div>

      <div className={styles.tableCard}>
        <DataTable
          columns={DIARY_COLUMNS}
          data={visibleRows}
          exportFileName="daily-diary-details"
        />
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Add new Tasks Details"
        maxWidth="980px"
        footer={
          <>
            <ActionButton
              type="submit"
              form="addDiaryTaskForm"
              variant="primary"
            >
              Submit
            </ActionButton>
            <ActionButton
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Close
            </ActionButton>
          </>
        }
      >
        <form
          id="addDiaryTaskForm"
          onSubmit={handleSaveTask}
          className={styles.modalFormBody}
        >
          <h4 className={styles.tasksSectionTitle}>Tasks</h4>

          {/* Row 1: Date, In Time, Out Time (For Tasks), Return Time */}
          <div className={styles.timeRow}>
            <div className={styles.modalField}>
              <label htmlFor="diaryDate" className={styles.modalLabel}>
                Date
              </label>
              <input
                id="diaryDate"
                type="text"
                value={newTask.date}
                readOnly
                className={`${styles.modalInput} ${styles.readOnlyField}`}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryInTime" className={styles.modalLabel}>
                In Time
              </label>
              <input
                id="diaryInTime"
                type="time"
                value={newTask.inTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, inTime: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryOutTime" className={styles.modalLabel}>
                Out Time (For Tasks)
              </label>
              <input
                id="diaryOutTime"
                type="time"
                value={newTask.outTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, outTime: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryReturnTime" className={styles.modalLabel}>
                Return Time
              </label>
              <input
                id="diaryReturnTime"
                type="time"
                value={newTask.returnTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, returnTime: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>
          </div>

          {/* Row 2: Places Visited & Vehicle No */}
          <div className={styles.twoColRow}>
            <div className={styles.modalField}>
              <label htmlFor="diaryPlacesVisited" className={styles.modalLabel}>
                Places Visited
              </label>
              <input
                id="diaryPlacesVisited"
                type="text"
                value={newTask.placesVisited}
                onChange={(e) =>
                  setNewTask({ ...newTask, placesVisited: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryVehicleNo" className={styles.modalLabel}>
                Vehicle No
              </label>
              <input
                id="diaryVehicleNo"
                type="text"
                value={newTask.vehicleNo}
                onChange={(e) =>
                  setNewTask({ ...newTask, vehicleNo: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>
          </div>

          {/* Row 3: Distance (KM) & Farm Details */}
          <div className={styles.twoColRow}>
            <div className={styles.modalField}>
              <label htmlFor="diaryDistance" className={styles.modalLabel}>
                Distance (KM)
              </label>
              <input
                id="diaryDistance"
                type="text"
                value={newTask.distance}
                onChange={(e) =>
                  setNewTask({ ...newTask, distance: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryFarmDetails" className={styles.modalLabel}>
                Farm Details
              </label>
              <select
                id="diaryFarmDetails"
                value={newTask.farmSelected}
                onChange={(e) =>
                  setNewTask({ ...newTask, farmSelected: e.target.value })
                }
                className={`${styles.modalSelect} ${
                  !newTask.farmSelected ? styles.selectPlaceholder : ""
                }`}
              >
                {FARM_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Tasks Textarea */}
          <div className={styles.modalField}>
            <label htmlFor="diaryTasksText" className={styles.modalLabel}>
              Tasks
            </label>
            <textarea
              id="diaryTasksText"
              rows={4}
              value={newTask.tasks}
              onChange={(e) => {
                setNewTask({ ...newTask, tasks: e.target.value });
                if (modalError) setModalError("");
              }}
              className={styles.modalTextarea}
            />
          </div>

          {/* Expandable Section 1: Special dairy farm development */}
          <div className={styles.collapsibleSection}>
            <button
              type="button"
              onClick={() => toggleSection("dairy")}
              className={styles.collapsibleHeader}
            >
              <span className={styles.triangle}>
                {expandedSections.dairy ? "▾" : "▸"}
              </span>
              <span>
                1. Special dairy farm development (24 hours or 4 half days are
                mandatory)
              </span>
            </button>

            {expandedSections.dairy && (
              <div className={styles.threeColRow}>
                <div className={styles.modalField}>
                  <label
                    htmlFor="farmerTrainingsHrs"
                    className={styles.modalLabel}
                  >
                    Farmer trainings (Hrs)
                  </label>
                  <input
                    id="farmerTrainingsHrs"
                    type="text"
                    value={newTask.farmerTrainingsHrs}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        farmerTrainingsHrs: e.target.value,
                      })
                    }
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalField}>
                  <label
                    htmlFor="onFarmFollowUpHrs"
                    className={styles.modalLabel}
                  >
                    On-farm follow-up (Hrs)
                  </label>
                  <input
                    id="onFarmFollowUpHrs"
                    type="text"
                    value={newTask.onFarmFollowUpHrs}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        onFarmFollowUpHrs: e.target.value,
                      })
                    }
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalField}>
                  <label
                    htmlFor="dataCollectionHrs"
                    className={styles.modalLabel}
                  >
                    Data collection and computerization (Hrs)
                  </label>
                  <input
                    id="dataCollectionHrs"
                    type="text"
                    value={newTask.dataCollectionHrs}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        dataCollectionHrs: e.target.value,
                      })
                    }
                    className={styles.modalInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Expandable Section 2: Development of goats, chickens and pigs */}
          <div className={styles.collapsibleSection}>
            <button
              type="button"
              onClick={() => toggleSection("livestock")}
              className={styles.collapsibleHeader}
            >
              <span className={styles.triangle}>
                {expandedSections.livestock ? "▾" : "▸"}
              </span>
              <span>
                2. Development of goats, chickens and pigs (12 hours or 2 half
                days)
              </span>
            </button>

            {expandedSections.livestock && (
              <div className={styles.fourColRow}>
                <div className={styles.modalField}>
                  <label htmlFor="pigsHrs" className={styles.modalLabel}>
                    Pigs (Hrs)
                  </label>
                  <input
                    id="pigsHrs"
                    type="text"
                    value={newTask.pigsHrs}
                    onChange={(e) =>
                      setNewTask({ ...newTask, pigsHrs: e.target.value })
                    }
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalField}>
                  <label htmlFor="chickensHrs" className={styles.modalLabel}>
                    Chickens (Hrs)
                  </label>
                  <input
                    id="chickensHrs"
                    type="text"
                    value={newTask.chickensHrs}
                    onChange={(e) =>
                      setNewTask({ ...newTask, chickensHrs: e.target.value })
                    }
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalField}>
                  <label htmlFor="goatsHrs" className={styles.modalLabel}>
                    Goats (Hrs)
                  </label>
                  <input
                    id="goatsHrs"
                    type="text"
                    value={newTask.goatsHrs}
                    onChange={(e) =>
                      setNewTask({ ...newTask, goatsHrs: e.target.value })
                    }
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalField}>
                  <label htmlFor="meetingsHrs" className={styles.modalLabel}>
                    Meetings (Hrs)
                  </label>
                  <input
                    id="meetingsHrs"
                    type="text"
                    value={newTask.meetingsHrs}
                    onChange={(e) =>
                      setNewTask({ ...newTask, meetingsHrs: e.target.value })
                    }
                    className={styles.modalInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Expandable Section 5: Animal Production Societies */}
          <div className={styles.collapsibleSection}>
            <button
              type="button"
              onClick={() => toggleSection("societies")}
              className={styles.collapsibleHeader}
            >
              <span className={styles.triangle}>
                {expandedSections.societies ? "▾" : "▸"}
              </span>
              <span>
                5. Animal Production Societies (12 hours or 2 half days are
                mandatory)
              </span>
            </button>

            {expandedSections.societies && (
              <div className={styles.fourColRow}>
                <div className={styles.modalField}>
                  <label
                    htmlFor="societiesTimeHrs"
                    className={styles.modalLabel}
                  >
                    Time (Hrs)
                  </label>
                  <input
                    id="societiesTimeHrs"
                    type="text"
                    value={newTask.societiesTimeHrs}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        societiesTimeHrs: e.target.value,
                      })
                    }
                    className={styles.modalInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Vaccination (Hrs), Mobile Service (Hrs), Other (Hrs) */}
          <div className={styles.hoursRow}>
            <div className={styles.modalField}>
              <label
                htmlFor="diaryVaccinationHrs"
                className={styles.modalLabel}
              >
                Vaccination (Hrs)
              </label>
              <input
                id="diaryVaccinationHrs"
                type="text"
                value={newTask.vaccinationHrs}
                onChange={(e) =>
                  setNewTask({ ...newTask, vaccinationHrs: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label
                htmlFor="diaryMobileServiceHrs"
                className={styles.modalLabel}
              >
                Mobile Service (Hrs)
              </label>
              <input
                id="diaryMobileServiceHrs"
                type="text"
                value={newTask.mobileServiceHrs}
                onChange={(e) =>
                  setNewTask({ ...newTask, mobileServiceHrs: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="diaryOtherHrs" className={styles.modalLabel}>
                Other (Hrs)
              </label>
              <input
                id="diaryOtherHrs"
                type="text"
                value={newTask.otherHrs}
                onChange={(e) =>
                  setNewTask({ ...newTask, otherHrs: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>
          </div>

          {modalError && <p className={styles.modalErrorText}>{modalError}</p>}
        </form>
      </Modal>
    </div>
  );
}
