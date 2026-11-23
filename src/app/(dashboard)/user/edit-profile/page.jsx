"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./EditProfile.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const [serviceNumber] = useState("");
  const [userName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please fill in both New Password and Confirm Password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "New Password and Confirm Password do not match.",
      });
      return;
    }

    setStatusMessage({
      type: "success",
      text: "Password updated successfully.",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className={styles.profileCard}>
      <h2 className={styles.heading}>Change My Password</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="serviceNumber" className={styles.label}>
            User Name
          </label>
          <input
            id="serviceNumber"
            type="text"
            value={serviceNumber}
            readOnly
            className={`${styles.input} ${styles.readOnlyInput}`}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="fullName" className={styles.label}>
            User Name
          </label>
          <input
            id="fullName"
            type="text"
            value={userName}
            readOnly
            className={`${styles.input} ${styles.readOnlyInput} ${styles.wideInput}`}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        {statusMessage.text && (
          <p
            className={
              statusMessage.type === "error"
                ? styles.errorText
                : styles.successText
            }
          >
            {statusMessage.text}
          </p>
        )}

        <div className={styles.actionsRow}>
          <button type="submit" className={styles.changeBtn}>
            Change
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
