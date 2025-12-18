import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

export default function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================
     LOAD PROFILE
  ============================ */
  useEffect(() => {
    const token = localStorage.getItem("student_token");

    if (!token) {
      navigate("/student-login");
      return;
    }

    API.get("/student-profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.data?.data?._id) {
          throw new Error("Invalid profile payload");
        }

        setStudent(res.data.data);

        // update navbar cache
        localStorage.setItem(
          "student_basic",
          JSON.stringify({
            _id: res.data.data._id,
            name: res.data.data.name,
            photoUrl: res.data.data.photoUrl,
          })
        );
      })
      .catch((err) => {
        console.error("Student profile error:", err);

        setError("Session expired. Please login again.");
        localStorage.removeItem("student_token");
        localStorage.removeItem("student_basic");

        setTimeout(() => {
          navigate("/student-login");
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

  if (!student) return null;

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">

        <div className="d-flex align-items-center mb-4">
          <img
            src={student.photoUrl || "/no-user.png"}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-circle me-3"
            style={{ objectFit: "cover" }}
          />
          <div>
            <h4 className="mb-0">{student.name}</h4>
            <small className="text-muted">
              Enrollment No: {student.enrollmentNo}
            </small>
          </div>
        </div>

        <hr />

        <p><strong>Course:</strong> {student.courseName || "—"}</p>
        <p><strong>Center:</strong> {student.centerName || "—"}</p>
        <p><strong>Status:</strong> {student.isActive ? "Active" : "Inactive"}</p>
        <p>
          <strong>Joined:</strong>{" "}
          {student.createdAt
            ? new Date(student.createdAt).toLocaleDateString()
            : "—"}
        </p>

      </div>
    </div>
  );
}
