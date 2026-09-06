import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { User } from "../types/user";

const Profile = () => {

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar user={user} />

      <main className="page-container">

        <h1>My Profile</h1>

        <div className="profile-card">

          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h2>{user.name}</h2>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user.role}
          </p>

          <p>
            <strong>Approval Status:</strong>
          </p>

          <span
            className={`status ${user.status.toLowerCase()}`}
          >
            {user.status}
          </span>

          {user.status === "PENDING" && (
            <div className="info-box">
              Your account is waiting for
              Admin approval.
            </div>
          )}

          {user.status === "APPROVED" && (
            <div className="success">
              Your account has been approved.
            </div>
          )}

          {user.status === "REJECTED" && (
            <div className="error">
              Your account has been rejected.
            </div>
          )}

        </div>

      </main>
    </>
  );
};

export default Profile;