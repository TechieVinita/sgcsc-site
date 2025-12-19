import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("student_token");
  const role = localStorage.getItem("user_role");

  if (!token || role !== "student") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
