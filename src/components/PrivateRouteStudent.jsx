// public-site/src/components/PrivateRouteStudent.jsx
import { Navigate } from 'react-router-dom';

export default function PrivateRouteStudent({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/student-login" replace />;
  return children;
}
