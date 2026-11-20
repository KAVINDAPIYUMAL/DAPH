import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Dashboard | Department of Animal Production and Health",
  description: "DAPH Management System Dashboard",
};

export default function MainDashboard() {
  const dashboardCards = [
    {
      title: "Allocate Sub Votes",
      route: "/allocate-sub-votes",
      icon: <i className="fa-solid fa-file-invoice-dollar" style={{ color: "#28a745" }}></i>,
    },
    {
      title: "Update My Tasks",
      route: "/update-task",
      icon: <i className="fa-solid fa-list-check" style={{ color: "#0d6efd" }}></i>,
    },
    {
      title: "Search Request",
      route: "/search-request",
      icon: <i className="fa-solid fa-magnifying-glass" style={{ color: "#6f42c1" }}></i>,
    },
    {
      title: "Allocate Salary To VS",
      route: "/allocate-salary-to-vs",
      icon: <i className="fa-solid fa-money-bill-transfer" style={{ color: "#fd7e14" }}></i>,
    },
    {
      title: "Capex Budget Create",
      route: "/capex-budget",
      icon: <i className="fa-solid fa-chart-pie" style={{ color: "#20c997" }}></i>,
    },
    {
      title: "Inventory Reports",
      route: "/reports",
      icon: <i className="fa-solid fa-warehouse" style={{ color: "#6610f2" }}></i>,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcomeBanner}>
        <h1>Department of Animal Production and Health</h1>
        <p>
          Welcome to the DAPH Management Information System. Select a task below or
          use the navigation menu to proceed.
        </p>
      </div>

      <div className={styles.gridContainer}>
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            route={card.route}
          />
        ))}
      </div>
    </div>
  );
}
