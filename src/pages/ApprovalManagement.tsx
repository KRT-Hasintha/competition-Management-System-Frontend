




import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import api from "../services/api";
import type { User } from "../types/user";

const ApprovalManagement = () => {

  const [user, setUser] =
    useState<User | null>(null);

  const [pendingUsers, setPendingUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  // Translation
  const { t } = useTranslation();


  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadPendingUsers();

  }, []);


  const loadPendingUsers = async () => {

    try {

      const response =
        await api.get(
          "/admin/pending-users"
        );

      setPendingUsers(
        response.data.users
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };


  const approveUser = async (
    userId: string,
    role: "JUDGE" | "TEACHER"
  ) => {

    try {

      await api.put(
        `/admin/approve/${userId}`,
        { role }
      );

      loadPendingUsers();

    } catch (error: any) {

      alert(
        error.response?.data?.message ||
        t("approvalFailed")
      );

    }
  };


  const rejectUser = async (
    userId: string
  ) => {

    try {

      await api.put(
        `/admin/reject/${userId}`
      );

      loadPendingUsers();

    } catch (error: any) {

      alert(
        error.response?.data?.message ||
        t("rejectionFailed")
      );

    }
  };


  if (!user) {
    return null;
  }


  return (
    <>
      <Navbar user={user} />

      <main className="page-container">

        <h1>
          {t("userApprovals")}
        </h1>


        {loading && (
          <p>
            {t("loading")}
          </p>
        )}


        {!loading &&
          pendingUsers.length === 0 && (

            <div className="info-box">
              {t("noPendingUsers")}
            </div>

          )}


        <div className="user-list">

          {pendingUsers.map(
            (pendingUser) => {

              const id =
                pendingUser._id ||
                pendingUser.id ||
                "";

              return (

                <div
                  className="user-card"
                  key={id}
                >

                  <div>

                    <h3>
                      {pendingUser.name}
                    </h3>

                    <p>
                      {pendingUser.email}
                    </p>

                    <span className="status pending">
                      {pendingUser.status}
                    </span>

                  </div>


                  <div className="approval-actions">

                    <button
                      onClick={() =>
                        approveUser(
                          id,
                          "JUDGE"
                        )
                      }
                    >
                      {t("approveAsJudge")}
                    </button>


                    <button
                      onClick={() =>
                        approveUser(
                          id,
                          "TEACHER"
                        )
                      }
                    >
                      {t("approveAsTeacher")}
                    </button>


                    <button
                      className="danger-btn"
                      onClick={() =>
                        rejectUser(id)
                      }
                    >
                      {t("reject")}
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      </main>
    </>
  );
};

export default ApprovalManagement;

