import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/student-profile/me");

        // 🔑 IMPORTANT FIX:
        // Backend returns { success, data }
        setStudent(res.data?.data || null);
      } catch (err) {
        console.error("Student profile fetch failed:", err);
        setError("Unable to load student profile at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container my-5 text-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Student Profile</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: "35%" }}>Enrollment Number</th>
                <td>{student.enrollmentNo || "-"}</td>
              </tr>

              <tr>
                <th>Name</th>
                <td>{student.name || "-"}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{student.email || "-"}</td>
              </tr>

              <tr>
                <th>Phone</th>
                <td>{student.phone || "-"}</td>
              </tr>

              <tr>
                <th>Date of Birth</th>
                <td>
                  {student.dob
                    ? new Date(student.dob).toLocaleDateString()
                    : "-"}
                </td>
              </tr>

              <tr>
                <th>Address</th>
                <td>{student.address || "-"}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {student.status || "Active"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
