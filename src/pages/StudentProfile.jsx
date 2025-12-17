// public-site/src/pages/StudentProfile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axiosInstance";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/student-login');
      return;
    }

    // Optional fast UI from cache
    const cached = localStorage.getItem('currentUser');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }

    API.get('/auth/student-me')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (!data || !data._id) {
          throw new Error('Invalid student payload');
        }
        setUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
      })
      .catch((err) => {
        console.error('❌ student-me error:', err);

        setError(
          err.userMessage ||
          err.response?.data?.message ||
          'Session expired. Please login again.'
        );

        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');

        setTimeout(() => {
          navigate('/student-login');
        }, 1500);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div className="container my-5">Loading profile…</div>;
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container my-5">
      <div className="card p-4 shadow-sm">
        <h4 className="mb-1">{user.name}</h4>
        <div className="text-muted">{user.email}</div>

        <hr />

        <p><strong>Contact:</strong> {user.contact || '—'}</p>
        <p>
          <strong>Joined:</strong>{' '}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : '—'}
        </p>
      </div>
    </div>
  );
}
