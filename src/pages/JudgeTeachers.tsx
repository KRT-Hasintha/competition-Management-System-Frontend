import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import type { User } from "../types/user";

const JudgeTeachers = () => {

  const [user, setUser] =
    useState<User | null>(null);

  const [teachers, setTeachers] =
    useState<User[]>([]);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadTeachers();

  }, []);

  const loadTeachers = async () => {

    try {

      const response =
        await api.get(
          "/users/teachers"
        );

      setTeachers(
        response.data.users
      );

    } catch (error) {

      console.error(error);

    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar user={user} />

      <main className="page-container">

        <h1>Teachers</h1>

        <div className="user-grid">

          {teachers.map((teacher) => (

            <div
              className="profile-card"
              key={
                teacher._id ||
                teacher.id
              }
            >

              <div className="profile-avatar">
                {teacher.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {teacher.name}
              </h2>

              <p>
                {teacher.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {teacher.role}
              </p>

              <span
                className={`status ${teacher.status.toLowerCase()}`}
              >
                {teacher.status}
              </span>

            </div>

          ))}

        </div>

      </main>
    </>
  );
};

export default JudgeTeachers;