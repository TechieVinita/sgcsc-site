import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("student_token");
  return token ? children : <Navigate to="/student-login" />;
}
