import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import type { User } from "../types/user";

const UserManagement = () => {

  const [user, setUser] =
    useState<User | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadUsers();

  }, []);

  const loadUsers = async () => {

    try {

      const response =
        await api.get("/admin/users");

      setUsers(response.data.users);

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

        <h1>All Users</h1>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {users.map((item) => (

                <tr
                  key={
                    item._id ||
                    item.id
                  }
                >

                  <td>
                    {item.name}
                  </td>

                  <td>
                    {item.email}
                  </td>

                  <td>
                    {item.role}
                  </td>

                  <td>
                    <span
                      className={`status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>
    </>
  );
};

export default UserManagement;