import { Navigate } from "react-router-dom";

export default function FranchiseProtectedRoute({ children }) {
  const token = localStorage.getItem("franchise_token");
  const role = localStorage.getItem("user_role");

  if (!token || role !== "franchise") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
