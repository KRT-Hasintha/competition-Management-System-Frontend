import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { User } from "../types/user";

const JudgeDashboard = () => {

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
    return null;
  }

  return (
    <>
      <Navbar user={user} />

      <main className="page-container">

        <h1>Judge Dashboard</h1>

        <div className="welcome-card">

          <h2>
            Welcome, {user.name}
          </h2>

          <p>
            You are logged in as a Judge.
          </p>

        </div>

      </main>
    </>
  );
};

export default JudgeDashboard;