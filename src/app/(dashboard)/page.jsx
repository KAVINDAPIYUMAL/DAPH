import DashboardCard from "@/components/DashboardCard";
import styles from "./dashboard.module.css";

export default function MainDashboard() {
  const dashboardModules = [
    {
      title: "Search Request",
      image: "/images/search.jpg",
      route: "/search-request",
    },
    {
      title: "Update Task",
      image: "/images/task.jpg",
      route: "/update-task",
    },
    {
      title: "Capex budget",
      image: "/images/budget.jpg",
      route: "/capex-budget",
    },
    {
      title: "Voucher Claim",
      image: "/images/voucher.jpg",
      route: "/voucher-claim",
    },
    {
      title: "Farm",
      image: "/images/farm.jpg",
      route: "/farm",
    },
    {
      title: "Inventory",
      image: "/images/inventory.jpg",
      route: "/inventory",
    },
    {
      title: "User Configuration",
      image: "/images/userconfiguration.jpg",
      route: "/user-config",
    },
    {
      title: "Daily Diary",
      image: "/images/budget.jpg",
      route: "/daily-diary",
    },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.gridContainer}>
        {dashboardModules.map((mod, index) => (
          <DashboardCard
            key={index}
            title={mod.title}
            image={mod.image}
            route={mod.route}
          />
        ))}
      </div>
    </div>
  );
}
