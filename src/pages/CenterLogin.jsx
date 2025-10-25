import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CenterLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    // Mock login check (Replace with actual API call)
    if (username === "admin" && password === "admin123") {
      alert("Login successful!");
      navigate("/dashboard"); // Change this route later as per your project
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // redirect to forgot password page
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4 fw-bold text-primary">
          Center Login
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger py-2">{error}</div>}

          {/* Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="btn btn-link text-decoration-none p-0"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
