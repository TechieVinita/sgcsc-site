import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axiosInstance";

export default function FranchiseLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/franchise-login', {
        identifier: identifier.trim(),
        password,
      });

      const data = res.data?.data ?? res.data;
      const token = data?.token;
      const user = data?.user ?? data?.franchise;

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('currentUser', JSON.stringify(user));

      navigate('/franchise/profile');
    } catch (err) {
      setError(err.userMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 720 }}>
      <div className="card shadow-sm overflow-hidden">
        <div className="row g-0">

          {/* RIGHT SIDE — FORM ONLY */}
          <div className="col-12">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold">Franchise Login</h3>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email or Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="owner@example.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* FULL WIDTH SIGN IN BUTTON */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

                {/* CENTERED LINKS */}
                <div className="text-center mt-3">
                  <a
                    className="text-primary text-decoration-underline"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/franchise-registration')}
                  >
                    Register as Franchise
                  </a>

                  <span className="mx-2 text-muted">|</span>

                  <a
                    className="text-primary text-decoration-underline"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/franchise-forgot-password')}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center small text-muted">
                Need help? Contact admin at{' '}
                <a href="mailto:ajayamaurya@gmail.com">ajayamaurya@gmail.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
