// public-site/src/pages/StudentSignup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function StudentSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/student-register', { name, email, password, rollNo, contact });
      const token = res.data.token ?? res.data?.data?.token;
      const user = res.data.user ?? res.data?.data;
      if (token) {
        localStorage.setItem('token', token);
        if (user) localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/student/profile');
      } else {
        // if server returns created user but no token, redirect to login
        navigate('/student-login');
      }
    } catch (err) {
      console.error('signup', err);
      setError(err.response?.data?.message || err.message || 'Signup failed');
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 640 }}>
      <h3 className="mb-4">Student Signup</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSignup}>
        <div className="row g-2 mb-2">
          <div className="col">
            <input className="form-control" placeholder="Full name" required value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div className="col">
            <input className="form-control" placeholder="Roll/Reg no (optional)" value={rollNo} onChange={(e)=>setRollNo(e.target.value)} />
          </div>
        </div>

        <div className="mb-2">
          <input className="form-control" type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>

        <div className="mb-2">
          <input className="form-control" placeholder="Contact (optional)" value={contact} onChange={(e)=>setContact(e.target.value)} />
        </div>

        <div className="mb-3">
          <input className="form-control" type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary">Create account</button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>navigate('/student-login')}>Back to login</button>
        </div>
      </form>
    </div>
  );
}
