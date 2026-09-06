




import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import api from "../services/api";
import type { User } from "../types/user";

const AdminDashboard = () => {

  const [user, setUser] =
    useState<User | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  // Translation
  const { t } = useTranslation();


  // =====================================================
  // LOAD USER + USERS
  // =====================================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadUsers();

  }, []);


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/admin/users");

      setUsers(
        response.data.users || []
      );

    } catch (error) {

      console.error(
        "Failed to load users:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // USER NOT LOADED
  // =====================================================

  if (!user) {
    return null;
  }


  // =====================================================
  // COUNTS
  // =====================================================

  const totalUsers =
    users.length;

  const pendingUsers =
    users.filter(
      (u) =>
        u.status === "PENDING"
    ).length;

  const approvedUsers =
    users.filter(
      (u) =>
        u.status === "APPROVED"
    ).length;


  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar user={user} />

      <main className="page-container">

        <h1>
          {t("adminDashboard")}
        </h1>

        <p>
          {t("welcomeAdmin")}
        </p>


        <div className="dashboard-grid">


          {/* =========================================
              TOTAL USERS
          ========================================= */}

          <div className="dashboard-card">

            <h3>
              {t("totalUsers")}
            </h3>

            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              {loading
                ? "..."
                : totalUsers}
            </div>

            <p>
              {t("allRegisteredUsers")}
            </p>

          </div>


          {/* =========================================
              PENDING USERS
          ========================================= */}

          <div className="dashboard-card">

            <h3>
              {t("pendingApprovals")}
            </h3>

            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              {loading
                ? "..."
                : pendingUsers}
            </div>

            <p>
              {t("usersWaitingApproval")}
            </p>

          </div>


          {/* =========================================
              APPROVED USERS
          ========================================= */}

          <div className="dashboard-card">

            <h3>
              {t("approvedUsers")}
            </h3>

            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              {loading
                ? "..."
                : approvedUsers}
            </div>

            <p>
              {t("approvedSystemUsers")}
            </p>

          </div>


        </div>

      </main>
    </>
  );
};

export default AdminDashboard;

