import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<"JUDGE" | "TEACHER">("TEACHER");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      setSuccess(
        "Registration successful! Your account is waiting for Admin approval."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Create Account</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nimal Silva"
            required
          />

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="nimal@gmail.com"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            required
          />

          <label>Select Role</label>

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as
                "JUDGE" | "TEACHER"
              )
            }
          >

            <option value="TEACHER">
              Teacher
            </option>

            <option value="JUDGE">
              Judge
            </option>

          </select>

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;