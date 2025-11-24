// public-site/src/pages/StudentLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/student-login', { email, password });
      // backend returns token + student (based on earlier controller)
      const token = res.data.token ?? res.data.data?.token ?? res.data?.token;
      const user = res.data.user ?? res.data.data?.user ?? res.data?.student ?? res.data?.data;
      if (!token) {
        // If your server returns different shape adjust accordingly
        // fallback: if login returns student object and token in nested property try res.data
      }
      localStorage.setItem('token', token);
      // optionally store currentUser snapshot
      if (user) localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/student/profile');
    } catch (err) {
      console.error('student login', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 540 }}>
      <h3 className="mb-4">Student Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary">Login</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/student/signup')}>Signup</button>
        </div>
      </form>
    </div>
  );
}
