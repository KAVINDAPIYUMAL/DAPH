"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(`.${styles.dropdown}`) &&
        !event.target.closest(`.${styles.menuToggle}`)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        {/* Left Side: Logo & Title */}
        <Link
          href="/"
          className={styles.brand}
          style={{ textDecoration: "none" }}
        >
          <img
            src="/images/sri-lanka.png"
            alt="DAPH Logo"
            className={styles.logo}
          />
          <span className={styles.title}>
            Department of Animal
            <br />
            Production and Health
          </span>
        </Link>

        {/* Right Side: Navigation */}
        <nav className={styles.navContainer}>
          {/* Hamburger Toggle Button for Mobile/Tablet */}
          <div
            className={styles.menuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fa fa-bars"></i>
          </div>

          <div
            className={`${styles.menu} ${isMobileMenuOpen ? styles.active : ""}`}
          >
            <div className={styles.menuItem}>
              <Link
                href="/"
                onClick={handleLinkClick}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Home
              </Link>
            </div>

            {/* Main Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "main" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("main", e)}
            >
              Main <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "main" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItem}>
                  <Link href="/main/search-request" onClick={handleLinkClick}>
                    Search Request
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Tasks Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "pending" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("pending", e)}
            >
              Pending Tasks <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "pending" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItem}>
                  <Link
                    href="/pending-tasks/update-task"
                    onClick={handleLinkClick}
                  >
                    Update my tasks
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/allocate-sub-votes" onClick={handleLinkClick}>
                    Allocate Sub Votes
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/allocate-salary-to-vs" onClick={handleLinkClick}>
                    Allocate Salary To Vs
                  </Link>
                </div>
              </div>
            </div>

            {/* Planning Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "planning" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("planning", e)}
            >
              Planning <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "planning" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItem}>
                  <Link
                    href="/create-request-claim-barcode"
                    onClick={handleLinkClick}
                  >
                    Create Request Claim Barcode
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/planning/create-request-claim"
                    onClick={handleLinkClick}
                  >
                    Request Claim Create
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/capex-budget-create" onClick={handleLinkClick}>
                    Capex Budget Create
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/capex-budget-update" onClick={handleLinkClick}>
                    Capex Budget Update
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/request-claim-confirm" onClick={handleLinkClick}>
                    Request Claim Confirm
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "account" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("account", e)}
            >
              Account <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "account" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItemGroup}>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/main-component-configuration"
                      onClick={handleLinkClick}
                    >
                      Main Component Configuration
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/sub-component-configuration"
                      onClick={handleLinkClick}
                    >
                      Sub Component Configuration
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/board-activity-configuration"
                      onClick={handleLinkClick}
                    >
                      Board Activity Configuration
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/sub-activity-configuration"
                      onClick={handleLinkClick}
                    >
                      Sub Activity Configuration
                    </Link>
                  </div>
                </div>
                <div className={styles.dropdownItemGroup}>
                  <div className={styles.dropdownItem}>
                    <Link href="/vote-configuration" onClick={handleLinkClick}>
                      Vote Configuration
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link href="/capex-vote-mapping" onClick={handleLinkClick}>
                      Capex Vote Mapping
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/budget-sub-vote-allocation"
                      onClick={handleLinkClick}
                    >
                      Budget Sub Vote Allocation
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/capex-broad-activity-allocation"
                      onClick={handleLinkClick}
                    >
                      Capex BroadActivity Allocation
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/broad-activity-vs-allocation"
                      onClick={handleLinkClick}
                    >
                      BroadActivity VS Allocation
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link href="/cash-update" onClick={handleLinkClick}>
                      Cash Update
                    </Link>
                  </div>
                </div>
                <div>
                  <div className={styles.dropdownItem}>
                    <Link href="/account-dashboard" onClick={handleLinkClick}>
                      Dashboard
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/board-activity-dashboard"
                      onClick={handleLinkClick}
                    >
                      Board Activity Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.menuItem}>
              <Link
                href="/inventory"
                onClick={handleLinkClick}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Inventory
              </Link>
            </div>
            <div className={styles.menuItem}>
              <Link
                href="/farm"
                onClick={handleLinkClick}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Farm
              </Link>
            </div>

            {/* Reports Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "reports" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("reports", e)}
            >
              Reports <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "reports" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItemGroup}>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/inventory-report"
                      onClick={handleLinkClick}
                    >
                      Inventory Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/vaccination-usage-report"
                      onClick={handleLinkClick}
                    >
                      Vaccination Usage Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/psdg-funds-drugs-issued-report"
                      onClick={handleLinkClick}
                    >
                      PSDG Funds Drugs Issued Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/veterinary-drug-monthly-progress-report"
                      onClick={handleLinkClick}
                    >
                      Veterinary Drug Monthly Progress Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/farm-registration-report"
                      onClick={handleLinkClick}
                    >
                      Farm Registration Report
                    </Link>
                  </div>
                </div>
                <div className={styles.dropdownItemGroup}>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/animal-health-report"
                      onClick={handleLinkClick}
                    >
                      Animal Health Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/animal-vaccination-history-report"
                      onClick={handleLinkClick}
                    >
                      Animal Vaccination History Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/ai-performance-report"
                      onClick={handleLinkClick}
                    >
                      AI Performance Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/pregnancy-diagnosis-report"
                      onClick={handleLinkClick}
                    >
                      Pregnancy Diagnosis Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/calving-performance-report"
                      onClick={handleLinkClick}
                    >
                      Calving Performance Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/animal-sold-report"
                      onClick={handleLinkClick}
                    >
                      Animal Sold Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/animal-postmortem-report"
                      onClick={handleLinkClick}
                    >
                      Animal PostMortem Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/farm-payment-data-report"
                      onClick={handleLinkClick}
                    >
                      Farm Payment Data Report
                    </Link>
                  </div>
                </div>
                <div className={styles.dropdownItemGroup}>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/cash-in-hand-report"
                      onClick={handleLinkClick}
                    >
                      Cash In Hand Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/all-payment-report"
                      onClick={handleLinkClick}
                    >
                      All Payment Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/advance-cashbook"
                      onClick={handleLinkClick}
                    >
                      Advace CashBook
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/votewise-payment-report"
                      onClick={handleLinkClick}
                    >
                      VoteWise Payment Report
                    </Link>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/allocation-utilization-report"
                      onClick={handleLinkClick}
                    >
                      Allocation Utilization Report
                    </Link>
                  </div>
                </div>
                <div>
                  <div className={styles.dropdownItem}>
                    <Link
                      href="/reports/daily-tasks-report"
                      onClick={handleLinkClick}
                    >
                      Daily Tasks Report
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "config" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("config", e)}
            >
              Configuration <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "config" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItem}>
                  <Link href="/user-config" onClick={handleLinkClick}>
                    User Configuration
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/area-code-configuration"
                    onClick={handleLinkClick}
                  >
                    Area Code Configuration
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/commercial-advance-account-category-configuration"
                    onClick={handleLinkClick}
                  >
                    Commercial Advance Account Category Configuration
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/treasury-code-configuration"
                    onClick={handleLinkClick}
                  >
                    Treasury Code Configuration
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/opex-object-configuration"
                    onClick={handleLinkClick}
                  >
                    Opex Object Configuration
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link
                    href="/dairy-knowledge-configuration"
                    onClick={handleLinkClick}
                  >
                    Dairy Knowledge Configuration
                  </Link>
                </div>
              </div>
            </div>

            {/* User Account Dropdown */}
            <div
              className={`${styles.menuItem} ${styles.dropdown} ${openDropdown === "user" ? styles.active : ""}`}
              onClick={(e) => toggleDropdown("user", e)}
            >
              Hi | MR.SANDUN <i className="fa fa-caret-down"></i>
              <div
                className={`${styles.dropdownMenu} ${openDropdown === "user" ? styles.show : ""}`}
              >
                <div className={styles.dropdownItem}>
                  <Link href="/user/edit-profile" onClick={handleLinkClick}>
                    Edit Profile
                  </Link>
                </div>
                <div className={styles.dropdownItem}>
                  <Link href="/login" onClick={handleLinkClick}>
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
