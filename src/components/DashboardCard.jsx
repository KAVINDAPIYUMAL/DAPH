import Link from "next/link";
import styles from "./DashboardCard.module.css";

export default function DashboardCard({ title, image, route }) {
  return (
    <Link href={route} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.cardImage} />
      </div>
      <div className={styles.cardFooter}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
    </Link>
  );
}
