import { useState } from "react";
import API from "../api/axiosInstance";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/student-auth/login", {
        username,
        password,
      });

      localStorage.setItem("student_token", res.data.token);
      window.location.href = "/student/profile";
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">Student Login</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
