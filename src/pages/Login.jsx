import { useState } from "react";
import API from "../api/axiosInstance";

export default function Login() {
  const [type, setType] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let res;

      if (type === "student") {
        res = await API.post("/student-auth/login", {
          username,
          password,
        });

        localStorage.setItem("student_token", res.data.token);
        localStorage.setItem("user_role", "student");

        window.location.href = "/student/profile";
      } else {
        res = await API.post("/franchise-auth/login", {
          username,
          password,
        });

        localStorage.setItem("franchise_token", res.data.token);
        localStorage.setItem("user_role", "franchise");

        window.location.href = "/franchise/profile";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3 text-center">Login</h3>

      <select
        className="form-select mb-3"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="franchise">Franchise</option>
      </select>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
