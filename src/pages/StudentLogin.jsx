import { useState } from "react";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setLoginMessage("Please enter both username and password.");
      return;
    }

    // Dummy authentication logic — replace with backend call later
    if (username === "student01" && password === "password123") {
      setLoginMessage("✅ Login successful! Redirecting...");
      // Example redirect (if routing to dashboard later)
      // navigate("/student-dashboard");
    } else {
      setLoginMessage("❌ Invalid username or password.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Student Login</h2>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>

        {loginMessage && (
          <div
            className={`alert mt-4 text-center ${
              loginMessage.includes("successful")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {loginMessage}
          </div>
        )}
      </div>
    </div>
  );
}
