import { Navigate } from "react-router-dom";

export default function FranchiseProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/franchise-login" replace />;
  }

  return children;
}
