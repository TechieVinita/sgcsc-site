// public-site/src/pages/StudentProfile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/auth/me');
        const duck = res.data?.data ?? res.data;
        setUser(duck);
      } catch (err) {
        console.error('me', err);
        // not authenticated — redirect to login
        localStorage.removeItem('token');
        navigate('/student-login');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) return <div className="container my-5">Loading profile...</div>;
  if (!user) return null;

  return (
    <div className="container my-5">
      <div className="card p-4">
        <div className="d-flex align-items-center gap-4">
          <div style={{ width: 90, height: 90, borderRadius: 10, background: '#efefef' }} />
          <div>
            <h4 className="mb-0">{user.name}</h4>
            <div className="small text-muted">{user.email}</div>
            <div className="small text-muted">Role: {user.role}</div>
          </div>
          <div className="ms-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <hr className="my-3" />

        <div>
          <h6>Student Details</h6>
          <dl className="row">
            <dt className="col-sm-3">Roll No</dt>
            <dd className="col-sm-9">{user.rollNo || '—'}</dd>

            <dt className="col-sm-3">Contact</dt>
            <dd className="col-sm-9">{user.contact || '—'}</dd>

            <dt className="col-sm-3">Joined</dt>
            <dd className="col-sm-9">{new Date(user.createdAt).toLocaleDateString()}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
